import type { Socket, Server } from 'socket.io';
import type { GameStore } from '../services/game-store.js';
import type { SessionStore } from '../services/session-store.js';
import type { TimerService } from '../services/timer-service.js';
import { validateMove } from '../services/move-validator.js';
import { checkGameEnd } from '../services/game-end-detector.js';
import { GameRoom } from '../rooms/game-room.js';

interface MakeMovePayload {
  gameId: string;
  move: string;
}

interface MakeMoveResponse {
  success: boolean;
}

interface MoveRejectedResponse {
  error: {
    code: string;
    message: string;
  };
}

/**
 * Handles the make_move WebSocket event.
 */
export function handleMakeMove(
  io: Server,
  socket: Socket,
  gameStore: GameStore,
  sessionStore: SessionStore,
  timerService: TimerService,
  payload: MakeMovePayload,
  callback?: (response: MakeMoveResponse | MoveRejectedResponse) => void
): void {
  const sessionId = socket.handshake.auth?.sessionId as string;
  const { gameId, move: moveStr } = payload;

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

  // Validate the move
  const validation = validateMove(game, sessionId, moveStr);
  if (!validation.valid) {
    socket.emit('move_rejected', {
      reason: validation.error!.code,
      message: validation.error!.message,
    });
    callback?.({ error: validation.error! });
    return;
  }

  // Execute the move
  const moveResult = game.gameState.makeMove(moveStr, false);
  if (!moveResult) {
    socket.emit('move_rejected', {
      reason: 'INVALID_MOVE',
      message: 'Move execution failed',
    });
    callback?.({ error: { code: 'INVALID_MOVE', message: 'Move execution failed' } });
    return;
  }

  // Add move to history
  game.moves.push(moveResult);

  // Update timer
  timerService.onMoveMade(gameId);

  // Get updated states
  const boardState = game.gameState.getBoardState();
  const timerState = timerService.getTimerState(gameId);

  // Broadcast move to all players
  const room = new GameRoom(io, gameId, gameStore, sessionStore);
  room.broadcastMove(moveResult, boardState, timerState!);

  // Check for game end
  const endCheck = checkGameEnd(boardState, boardState.turn);
  if (endCheck.isEnded && endCheck.result) {
    // Stop timers
    timerService.stopGame(gameId);

    // End the game
    gameStore.endGame(gameId, endCheck.result);

    // Broadcast game over
    room.broadcastGameOver(endCheck.result, boardState);
  }

  callback?.({ success: true });
  console.log(`Move ${moveStr} made in game ${gameId} by ${sessionId}`);
}
