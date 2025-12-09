import type { Server } from 'socket.io';
import type { GameStore } from '../services/game-store.js';
import type { SessionStore } from '../services/session-store.js';
import type { GameResult } from '@anti-flag-chess/core';
import { GameRoom } from '../rooms/game-room.js';

/**
 * Broadcasts game over to all players in a game.
 */
export function broadcastGameOver(
  io: Server,
  gameStore: GameStore,
  sessionStore: SessionStore,
  gameId: string,
  result: GameResult
): void {
  const game = gameStore.getGame(gameId);
  if (!game) return;

  const finalBoardState = game.gameState.getBoardState();
  const room = new GameRoom(io, gameId, gameStore, sessionStore);
  room.broadcastGameOver(result, finalBoardState);
}
