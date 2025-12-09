import type { PromotionPiece } from '../types/move.js';
import { PROMOTION_PIECES } from '../types/move.js';

/**
 * Randomly selects a promotion piece.
 * Per spec: randomly select from Queen, Rook, Bishop, Knight.
 */
export function randomPromotion(): PromotionPiece {
  const index = Math.floor(Math.random() * PROMOTION_PIECES.length);
  return PROMOTION_PIECES[index];
}

/**
 * Checks if a move string indicates a promotion.
 * Promotion moves end with =Q, =R, =B, =N (case insensitive).
 */
export function isPromotionMove(move: string): boolean {
  // chess.js returns promotion moves like "e8=Q" or just marks them internally
  // We check for the = sign followed by a promotion piece
  return /=[qrbn]$/i.test(move);
}

/**
 * Extracts the promotion piece from a move string.
 * Returns null if not a promotion move.
 */
export function getPromotionPiece(move: string): PromotionPiece | null {
  const match = move.match(/=([qrbn])$/i);
  if (match) {
    return match[1].toLowerCase() as PromotionPiece;
  }
  return null;
}
