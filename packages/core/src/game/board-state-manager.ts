import { Chess } from 'chess.js';
import type { BoardState, DrawReason } from '../types/board-state.js';

/**
 * Derives BoardState from a chess.js instance.
 * Used for creating snapshots of board state without modifying the game.
 */
export class BoardStateManager {
  /**
   * Creates a BoardState from a FEN string.
   */
  static fromFen(fen: string): BoardState {
    const chess = new Chess(fen);
    return BoardStateManager.fromChess(chess);
  }

  /**
   * Creates a BoardState from a chess.js instance.
   */
  static fromChess(chess: Chess): BoardState {
    const isCheckmate = chess.isCheckmate();
    const isStalemate = chess.isStalemate();
    const isDraw = chess.isDraw();

    let drawReason: DrawReason | null = null;
    if (isDraw && !isStalemate) {
      if (chess.isThreefoldRepetition()) {
        drawReason = 'threefold_repetition';
      } else if (chess.isInsufficientMaterial()) {
        drawReason = 'insufficient_material';
      } else {
        drawReason = 'fifty_move_rule';
      }
    }

    return {
      fen: chess.fen(),
      turn: chess.turn() === 'w' ? 'white' : 'black',
      isCheck: chess.isCheck(),
      isCheckmate,
      isStalemate,
      isDraw,
      drawReason,
      legalMoves: chess.moves(),
    };
  }

  /**
   * Validates that a FEN string is valid.
   */
  static isValidFen(fen: string): boolean {
    try {
      new Chess(fen);
      return true;
    } catch {
      return false;
    }
  }
}
