import type { GameState } from '../game/game-state.js';
import { randomPromotion, isPromotionMove } from './random-promotion.js';

/**
 * Selects an auto-move when time expires.
 * Prioritizes pawn moves, falls back to any legal move.
 *
 * @param gameState - Current game state
 * @returns Selected move in SAN notation, or null if no legal moves
 */
export function selectAutoMove(gameState: GameState): string | null {
  // First try to get pawn moves
  const pawnMoves = gameState.getLegalMovesForPiece('p');

  if (pawnMoves.length > 0) {
    const selectedMove = pawnMoves[Math.floor(Math.random() * pawnMoves.length)];
    return handlePromotion(selectedMove);
  }

  // Fall back to any legal move
  const allMoves = gameState.getLegalMoves();

  if (allMoves.length === 0) {
    return null; // No legal moves (checkmate/stalemate)
  }

  const selectedMove = allMoves[Math.floor(Math.random() * allMoves.length)];
  return handlePromotion(selectedMove);
}

/**
 * If the move is a promotion, randomize the promotion piece.
 */
function handlePromotion(move: string): string {
  if (isPromotionMove(move)) {
    // Replace any existing promotion with random piece
    const baseMove = move.replace(/=[qrbn]/i, '');
    return `${baseMove}=${randomPromotion()}`;
  }
  return move;
}

/**
 * Alternative function that returns detailed info about the selection.
 */
export interface AutoMoveSelection {
  move: string;
  isPawnMove: boolean;
  isPromotion: boolean;
}

export function selectAutoMoveWithInfo(gameState: GameState): AutoMoveSelection | null {
  const pawnMoves = gameState.getLegalMovesForPiece('p');

  if (pawnMoves.length > 0) {
    const baseMove = pawnMoves[Math.floor(Math.random() * pawnMoves.length)];
    const finalMove = handlePromotion(baseMove);
    return {
      move: finalMove,
      isPawnMove: true,
      isPromotion: isPromotionMove(baseMove),
    };
  }

  const allMoves = gameState.getLegalMoves();

  if (allMoves.length === 0) {
    return null;
  }

  const baseMove = allMoves[Math.floor(Math.random() * allMoves.length)];
  const finalMove = handlePromotion(baseMove);
  return {
    move: finalMove,
    isPawnMove: false,
    isPromotion: isPromotionMove(baseMove),
  };
}
