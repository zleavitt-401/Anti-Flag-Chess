import type { Socket, Server } from 'socket.io';
import type { GameStore } from '../services/game-store.js';
import type { SessionStore } from '../services/session-store.js';
import { generateGameId } from '../services/game-id.js';
import { generateInviteLink } from '../services/invite-link.js';
import { validateGameSettings, validateCompleteSettings, createPlayerSession, DEFAULT_GAME_SETTINGS } from '@anti-flag-chess/core';
import type { GameSettings } from '@anti-flag-chess/core';
import { GameRoom } from '../rooms/game-room.js';

interface CreateGamePayload {
  settings: Partial<GameSettings>;
}

interface CreateGameResponse {
  gameId: string;
  inviteLink: string;
  settings: GameSettings;
  hostColor: 'white' | 'black';
}

/**
 * Handles the create_game WebSocket event.
 */
export function handleCreateGame(
  io: Server,
  socket: Socket,
  gameStore: GameStore,
  sessionStore: SessionStore,
  payload: CreateGamePayload,
  callback?: (response: CreateGameResponse | { error: { code: string; message: string } }) => void
): void {
  const sessionId = socket.handshake.auth?.sessionId as string;

  if (!sessionId) {
    callback?.({ error: { code: 'NO_SESSION', message: 'No session ID provided' } });
    return;
  }

  // Merge with defaults
  const settings: GameSettings = {
    ...DEFAULT_GAME_SETTINGS,
    ...payload.settings,
  };

  // Validate settings
  const validation = validateGameSettings(settings);
  if (!validation.valid) {
    callback?.({
      error: {
        code: 'INVALID_SETTINGS',
        message: validation.errors.join(', '),
      },
    });
    return;
  }

  if (!validateCompleteSettings(settings)) {
    callback?.({
      error: {
        code: 'INVALID_SETTINGS',
        message: 'Incomplete settings provided',
      },
    });
    return;
  }

  // Generate game ID
  const gameId = generateGameId();

  // Create host session
  const hostSession = createPlayerSession(sessionId, socket.id, settings.hostColor);

  // Create game
  const game = gameStore.createGame(gameId, settings, hostSession);

  // Associate session with game
  sessionStore.setSessionGame(sessionId, gameId);

  // Create room and join
  const room = new GameRoom(io, gameId, gameStore, sessionStore);
  room.join(socket);

  // Generate invite link
  const inviteLink = generateInviteLink(gameId);

  // Send response
  const response: CreateGameResponse = {
    gameId,
    inviteLink,
    settings: game.settings,
    hostColor: settings.hostColor,
  };

  callback?.(response);

  console.log(`Game created: ${gameId} by session ${sessionId}`);
}
