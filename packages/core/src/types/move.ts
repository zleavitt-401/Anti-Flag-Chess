/**
 * Chess piece types (lowercase as per chess.js convention).
 */
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

/**
 * Pieces a pawn can promote to.
 */
export type PromotionPiece = 'q' | 'r' | 'b' | 'n';

/**
 * A single chess move in the game history.
 */
export interface Move {
  /** Standard Algebraic Notation (e.g., "e4", "Nxf3+") */
  san: string;
  /** Source square (e.g., "e2") */
  from: string;
  /** Target square (e.g., "e4") */
  to: string;
  /** Piece that moved */
  piece: PieceType;
  /** Piece captured, if any */
  captured: PieceType | null;
  /** Promotion piece, if pawn promoted */
  promotion: PromotionPiece | null;
  /** True if system-generated due to timeout */
  isAutoMove: boolean;
  /** Unix timestamp ms when move was made */
  timestamp: number;
  /** Who made the move */
  color: 'white' | 'black';
}

/**
 * All valid promotion pieces for random selection.
 */
export const PROMOTION_PIECES: PromotionPiece[] = ['q', 'r', 'b', 'n'];
