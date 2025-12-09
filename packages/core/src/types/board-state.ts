/**
 * Reason for a draw.
 */
export type DrawReason =
  | 'threefold_repetition'
  | 'fifty_move_rule'
  | 'insufficient_material';

/**
 * Current chess position state, derived from chess.js.
 */
export interface BoardState {
  /** FEN notation for position */
  fen: string;
  /** Whose turn it is */
  turn: 'white' | 'black';
  /** Is the current player's king in check */
  isCheck: boolean;
  /** Is the game over by checkmate */
  isCheckmate: boolean;
  /** Is the game over by stalemate */
  isStalemate: boolean;
  /** Is the game over by a draw rule */
  isDraw: boolean;
  /** If isDraw is true, the reason */
  drawReason: DrawReason | null;
  /** Legal moves in SAN notation for current position */
  legalMoves: string[];
}

/** Starting position FEN */
export const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
