import type { Socket, Server } from 'socket.io';
import type { GameStore } from '../services/game-store.js';
import type { SessionStore } from '../services/session-store.js';

interface DrawOfferPayload {
  gameId: string;
}

interface DrawOfferResponse {
  success: boolean;
}

interface DrawOfferErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

/**
 * Handles the offer_draw WebSocket event.
 */
export function handleDrawOffer(
  io: Server,
  socket: Socket,
  gameStore: GameStore,
  sessionStore: SessionStore,
  payload: DrawOfferPayload,
  callback?: (response: DrawOfferResponse | DrawOfferErrorResponse) => void
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

  // Determine which player is offering
  let offeringColor: 'white' | 'black' | null = null;
  if (game.players.white?.sessionId === sessionId) {
    offeringColor = 'white';
  } else if (game.players.black?.sessionId === sessionId) {
    offeringColor = 'black';
  }

  if (!offeringColor) {
    callback?.({ error: { code: 'NOT_IN_GAME', message: 'You are not a player in this game' } });
    return;
  }

  // Check if there's already a pending draw offer
  if (game.pendingDrawOffer) {
    callback?.({ error: { code: 'DRAW_ALREADY_OFFERED', message: 'There is already a pending draw offer' } });
    return;
  }

  // Set the draw offer
  gameStore.setDrawOffer(gameId, offeringColor);

  // Send draw_offered to opponent
  const opponentColor = offeringColor === 'white' ? 'black' : 'white';
  const opponent = game.players[opponentColor];
  if (opponent?.socketId) {
    io.to(opponent.socketId).emit('draw_offered', { from: offeringColor });
  }

  callback?.({ success: true });
  console.log(`Player ${sessionId} offered draw in game ${gameId}`);
}
