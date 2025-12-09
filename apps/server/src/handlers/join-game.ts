import type { Socket, Server } from 'socket.io';
import type { GameStore } from '../services/game-store.js';
import type { SessionStore } from '../services/session-store.js';
import type { TimerService } from '../services/timer-service.js';
import { createPlayerSession } from '@anti-flag-chess/core';
import type { GameSettings, BoardState, TimerState } from '@anti-flag-chess/core';
import { GameRoom } from '../rooms/game-room.js';

interface JoinGamePayload {
  gameId: string;
}

interface JoinGameResponse {
  gameId: string;
  playerColor: 'white' | 'black';
  opponentConnected: boolean;
  settings: GameSettings;
}

interface GameStartEvent {
  gameId: string;
  boardState: BoardState;
  timers: TimerState;
  whiteSessionId: string;
  blackSessionId: string;
}

/**
 * Handles the join_game WebSocket event.
 */
export function handleJoinGame(
  io: Server,
  socket: Socket,
  gameStore: GameStore,
  sessionStore: SessionStore,
  timerService: TimerService,
  payload: JoinGamePayload,
  callback?: (response: JoinGameResponse | { error: { code: string; message: string } }) => void
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

  // Check if game is in valid state
  if (game.status === 'ended') {
    callback?.({ error: { code: 'GAME_ALREADY_STARTED', message: 'Game has ended' } });
    return;
  }

  if (game.status === 'active') {
    // Check if this session is already a player (reconnection)
    const isWhite = game.players.white?.sessionId === sessionId;
    const isBlack = game.players.black?.sessionId === sessionId;

    if (!isWhite && !isBlack) {
      callback?.({ error: { code: 'GAME_FULL', message: 'Game is already in progress' } });
      return;
    }

    // This is a reconnection - handled by rejoin_game instead
    callback?.({ error: { code: 'GAME_ALREADY_STARTED', message: 'Use rejoin_game for reconnection' } });
    return;
  }

  // Check if joining player is the host (can't join your own game)
  const isHost = game.players.white?.sessionId === sessionId || game.players.black?.sessionId === sessionId;
  if (isHost) {
    callback?.({ error: { code: 'GAME_FULL', message: 'You are already in this game' } });
    return;
  }

  // Determine joiner's color (opposite of host)
  const joinerColor = game.players.white ? 'black' : 'white';

  // Create joiner session
  const joinerSession = createPlayerSession(sessionId, socket.id, joinerColor);

  // Add player to game
  const updatedGame = gameStore.addPlayer(gameId, joinerSession);
  if (!updatedGame) {
    callback?.({ error: { code: 'GAME_FULL', message: 'Failed to join game' } });
    return;
  }

  // Associate session with game
  sessionStore.setSessionGame(sessionId, gameId);

  // Join socket room
  const room = new GameRoom(io, gameId, gameStore, sessionStore);
  room.join(socket);

  // Send response to joiner
  const response: JoinGameResponse = {
    gameId,
    playerColor: joinerColor,
    opponentConnected: true,
    settings: updatedGame.settings,
  };
  callback?.(response);

  // Get host socket and notify about game start
  const hostSession = joinerColor === 'black' ? updatedGame.players.white : updatedGame.players.black;

  if (hostSession && updatedGame.status === 'active') {
    // Start the timer service for this game
    timerService.startGame(
      gameId,
      updatedGame.settings.turnTimeSeconds,
      updatedGame.settings.gracePeriodSeconds
    );

    // Get initial timer state from timer service
    const timers = timerService.getTimerState(gameId);
    const boardState = updatedGame.gameState.getBoardState();

    // Broadcast game start to both players
    const gameStartEvent: GameStartEvent = {
      gameId,
      boardState,
      timers: timers!,
      whiteSessionId: updatedGame.players.white!.sessionId,
      blackSessionId: updatedGame.players.black!.sessionId,
    };

    room.broadcastGameStart(
      gameStartEvent.boardState,
      gameStartEvent.timers,
      gameStartEvent.whiteSessionId,
      gameStartEvent.blackSessionId
    );

    console.log(`Game ${gameId} started - White: ${gameStartEvent.whiteSessionId}, Black: ${gameStartEvent.blackSessionId}`);
  }

  console.log(`Session ${sessionId} joined game ${gameId} as ${joinerColor}`);
}
