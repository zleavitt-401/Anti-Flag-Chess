import type { Socket, Server } from 'socket.io';
import type { GameStore } from '../services/game-store.js';
import type { SessionStore } from '../services/session-store.js';
import type { TimerService } from '../services/timer-service.js';
import { GameRoom } from '../rooms/game-room.js';

interface RejoinGamePayload {
  gameId: string;
}

interface RejoinGameResponse {
  success: boolean;
  gameState?: {
    boardState: ReturnType<import('@anti-flag-chess/core').GameState['getBoardState']>;
    moves: import('@anti-flag-chess/core').Move[];
    settings: import('@anti-flag-chess/core').GameSettings;
    status: import('@anti-flag-chess/core').GameStatus;
    timerState: import('@anti-flag-chess/core').TimerState | null;
  };
  playerColor?: 'white' | 'black';
}

interface RejoinGameErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

/**
 * Handles the rejoin_game WebSocket event.
 */
export function handleRejoinGame(
  io: Server,
  socket: Socket,
  gameStore: GameStore,
  sessionStore: SessionStore,
  timerService: TimerService,
  payload: RejoinGamePayload,
  callback?: (response: RejoinGameResponse | RejoinGameErrorResponse) => void
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

  // Verify this session is a player in this game
  let playerColor: 'white' | 'black' | null = null;
  if (game.players.white?.sessionId === sessionId) {
    playerColor = 'white';
  } else if (game.players.black?.sessionId === sessionId) {
    playerColor = 'black';
  }

  if (!playerColor) {
    callback?.({ error: { code: 'NOT_IN_GAME', message: 'You are not a player in this game' } });
    return;
  }

  // Check game is still active or waiting
  if (game.status === 'ended') {
    callback?.({ error: { code: 'GAME_ENDED', message: 'Game has already ended' } });
    return;
  }

  // Update player's socket ID and connection status
  gameStore.updatePlayer(gameId, sessionId, {
    socketId: socket.id,
    isConnected: true,
  });

  // Update session store
  sessionStore.setSessionGame(sessionId, gameId);

  // Join the game room
  const room = new GameRoom(io, gameId, gameStore, sessionStore);
  room.join(socket);

  // Notify opponent that player reconnected
  const opponentColor = playerColor === 'white' ? 'black' : 'white';
  const opponent = game.players[opponentColor];
  if (opponent?.socketId) {
    io.to(opponent.socketId).emit('opponent_reconnected', { playerColor });
  }

  // Get current timer state
  const timerState = timerService.getTimerState(gameId);

  // Send current game state to reconnecting player
  callback?.({
    success: true,
    gameState: {
      boardState: game.gameState.getBoardState(),
      moves: game.moves,
      settings: game.settings,
      status: game.status,
      timerState,
    },
    playerColor,
  });

  console.log(`Session ${sessionId} rejoined game ${gameId} as ${playerColor}`);
}
