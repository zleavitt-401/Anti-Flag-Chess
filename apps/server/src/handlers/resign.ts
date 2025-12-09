import type { Socket, Server } from 'socket.io';
import type { GameStore } from '../services/game-store.js';
import type { SessionStore } from '../services/session-store.js';
import type { TimerService } from '../services/timer-service.js';
import { GameRoom } from '../rooms/game-room.js';
import type { GameResult } from '@anti-flag-chess/core';

interface ResignPayload {
  gameId: string;
}

interface ResignResponse {
  success: boolean;
}

interface ResignErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

/**
 * Handles the resign WebSocket event.
 */
export function handleResign(
  io: Server,
  socket: Socket,
  gameStore: GameStore,
  sessionStore: SessionStore,
  timerService: TimerService,
  payload: ResignPayload,
  callback?: (response: ResignResponse | ResignErrorResponse) => void
): void {
  const sessionId = socket.handshake.auth?.sessionId as string;
  const { gameId } = payload;

  if (!sessionId) {
    callback?.({ error: { code: 'NO_SESSION', message: 'No session ID provided' } });
    return;
  }

  // Get the game
  const game = gameStore.getGame(gameId);
  if (!game) {
    callback?.({ error: { code: 'GAME_NOT_FOUND', message: 'Game not found' } });
    return;
  }

  // Check game is active
  if (game.status !== 'active') {
    callback?.({ error: { code: 'GAME_NOT_ACTIVE', message: 'Game is not active' } });
    return;
  }

  // Determine which player is resigning
  let resigningColor: 'white' | 'black' | null = null;
  if (game.players.white?.sessionId === sessionId) {
    resigningColor = 'white';
  } else if (game.players.black?.sessionId === sessionId) {
    resigningColor = 'black';
  }

  if (!resigningColor) {
    callback?.({ error: { code: 'NOT_IN_GAME', message: 'You are not a player in this game' } });
    return;
  }

  // Create resignation result
  const winner = resigningColor === 'white' ? 'black' : 'white';
  const result: GameResult = {
    winner,
    reason: 'resignation',
  };

  // Stop timers
  timerService.stopGame(gameId);

  // End the game
  gameStore.endGame(gameId, result);

  // Broadcast game over
  const room = new GameRoom(io, gameId, gameStore, sessionStore);
  room.broadcastGameOver(result, game.gameState.getBoardState());

  callback?.({ success: true });
  console.log(`Player ${sessionId} resigned game ${gameId}`);
}
