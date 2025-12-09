import type { Socket, Server } from 'socket.io';
import type { GameStore } from '../services/game-store.js';
import type { SessionStore } from '../services/session-store.js';
import type { TimerService } from '../services/timer-service.js';
import { GameRoom } from '../rooms/game-room.js';
import type { GameResult } from '@anti-flag-chess/core';

interface DrawResponsePayload {
  gameId: string;
  accept: boolean;
}

interface DrawResponseResponse {
  success: boolean;
}

interface DrawResponseErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

/**
 * Handles the respond_draw WebSocket event.
 */
export function handleDrawResponse(
  io: Server,
  socket: Socket,
  gameStore: GameStore,
  sessionStore: SessionStore,
  timerService: TimerService,
  payload: DrawResponsePayload,
  callback?: (response: DrawResponseResponse | DrawResponseErrorResponse) => void
): void {
  const sessionId = socket.handshake.auth?.sessionId as string;
  const { gameId, accept } = payload;

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

  // Determine which player is responding
  let respondingColor: 'white' | 'black' | null = null;
  if (game.players.white?.sessionId === sessionId) {
    respondingColor = 'white';
  } else if (game.players.black?.sessionId === sessionId) {
    respondingColor = 'black';
  }

  if (!respondingColor) {
    callback?.({ error: { code: 'NOT_IN_GAME', message: 'You are not a player in this game' } });
    return;
  }

  // Check if there's a pending draw offer
  if (!game.pendingDrawOffer) {
    callback?.({ error: { code: 'NO_DRAW_OFFER', message: 'There is no pending draw offer' } });
    return;
  }

  // Can't respond to your own draw offer
  if (game.pendingDrawOffer.from === respondingColor) {
    callback?.({ error: { code: 'CANT_RESPOND_OWN', message: 'Cannot respond to your own draw offer' } });
    return;
  }

  const room = new GameRoom(io, gameId, gameStore, sessionStore);

  if (accept) {
    // Create draw result
    const result: GameResult = {
      winner: 'draw',
      reason: 'agreed_draw',
    };

    // Stop timers
    timerService.stopGame(gameId);

    // End the game
    gameStore.endGame(gameId, result);

    // Broadcast game over
    room.broadcastGameOver(result, game.gameState.getBoardState());

    console.log(`Draw accepted in game ${gameId}`);
  } else {
    // Clear the draw offer
    gameStore.clearDrawOffer(gameId);

    // Notify the offerer that draw was declined
    const offerer = game.players[game.pendingDrawOffer.from];
    if (offerer?.socketId) {
      io.to(offerer.socketId).emit('draw_declined', {});
    }

    console.log(`Draw declined in game ${gameId}`);
  }

  callback?.({ success: true });
}
