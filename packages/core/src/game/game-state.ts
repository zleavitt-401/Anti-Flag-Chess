import { Chess, Move as ChessMove } from 'chess.js';
import type { BoardState, DrawReason } from '../types/board-state.js';
import type { Move, PieceType, PromotionPiece } from '../types/move.js';
import { STARTING_FEN } from '../types/board-state.js';

/**
 * Wraps chess.js to provide game state management with Anti-Flag Chess types.
 */
export class GameState {
  private chess: Chess;
  private moveHistory: Move[] = [];

  constructor(fen: string = STARTING_FEN) {
    this.chess = new Chess(fen);
  }

  /**
   * Gets the current board state.
   */
  getBoardState(): BoardState {
    const isCheckmate = this.chess.isCheckmate();
    const isStalemate = this.chess.isStalemate();
    const isDraw = this.chess.isDraw();

    let drawReason: DrawReason | null = null;
    if (isDraw && !isStalemate) {
      if (this.chess.isThreefoldRepetition()) {
        drawReason = 'threefold_repetition';
      } else if (this.chess.isInsufficientMaterial()) {
        drawReason = 'insufficient_material';
      } else {
        // Must be fifty-move rule
        drawReason = 'fifty_move_rule';
      }
    }

    return {
      fen: this.chess.fen(),
      turn: this.chess.turn() === 'w' ? 'white' : 'black',
      isCheck: this.chess.isCheck(),
      isCheckmate,
      isStalemate,
      isDraw,
      drawReason,
      legalMoves: this.chess.moves(),
    };
  }

  /**
   * Gets all legal moves for the current position.
   */
  getLegalMoves(): string[] {
    return this.chess.moves();
  }

  /**
   * Gets legal moves for a specific piece type.
   */
  getLegalMovesForPiece(piece: PieceType): string[] {
    return this.chess.moves({ piece });
  }

  /**
   * Attempts to make a move. Returns the move if successful, null if invalid.
   */
  makeMove(san: string, isAutoMove: boolean = false): Move | null {
    try {
      const result = this.chess.move(san);
      if (!result) return null;

      const move = this.convertToMove(result, isAutoMove);
      this.moveHistory.push(move);
      return move;
    } catch {
      return null;
    }
  }

  /**
   * Checks if a move is legal without making it.
   * Accepts both SAN (e4, Nf3) and UCI notation (e2e4, g1f3).
   */
  isLegalMove(moveStr: string): boolean {
    // First check SAN list
    const moves = this.chess.moves();
    if (moves.includes(moveStr)) {
      return true;
    }

    // Try to validate by attempting the move on a copy
    // chess.js move() handles UCI notation with its permissive parser
    try {
      const chessCopy = new Chess(this.chess.fen());
      const result = chessCopy.move(moveStr);
      return result !== null;
    } catch {
      return false;
    }
  }

  /**
   * Gets the current turn color.
   */
  getCurrentTurn(): 'white' | 'black' {
    return this.chess.turn() === 'w' ? 'white' : 'black';
  }

  /**
   * Checks if the game is over.
   */
  isGameOver(): boolean {
    return this.chess.isGameOver();
  }

  /**
   * Gets the move history.
   */
  getMoveHistory(): Move[] {
    return [...this.moveHistory];
  }

  /**
   * Gets the FEN string for the current position.
   */
  getFen(): string {
    return this.chess.fen();
  }

  /**
   * Resets the game to starting position.
   */
  reset(): void {
    this.chess.reset();
    this.moveHistory = [];
  }

  /**
   * Loads a position from FEN.
   */
  loadFen(fen: string): boolean {
    try {
      this.chess.load(fen);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Converts a chess.js move to our Move type.
   */
  private convertToMove(chessMove: ChessMove, isAutoMove: boolean): Move {
    return {
      san: chessMove.san,
      from: chessMove.from,
      to: chessMove.to,
      piece: chessMove.piece as PieceType,
      captured: chessMove.captured ? (chessMove.captured as PieceType) : null,
      promotion: chessMove.promotion ? (chessMove.promotion as PromotionPiece) : null,
      isAutoMove,
      timestamp: Date.now(),
      color: chessMove.color === 'w' ? 'white' : 'black',
    };
  }
}
