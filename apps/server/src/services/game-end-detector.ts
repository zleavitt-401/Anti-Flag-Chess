import type { BoardState, GameResult, GameEndReason } from '@anti-flag-chess/core';

export interface GameEndCheck {
  isEnded: boolean;
  result: GameResult | null;
}

/**
 * Checks if the game has ended based on board state.
 */
export function checkGameEnd(boardState: BoardState, currentTurn: 'white' | 'black'): GameEndCheck {
  // Checkmate
  if (boardState.isCheckmate) {
    return {
      isEnded: true,
      result: {
        winner: currentTurn === 'white' ? 'black' : 'white', // Previous player won
        reason: 'checkmate',
      },
    };
  }

  // Stalemate
  if (boardState.isStalemate) {
    return {
      isEnded: true,
      result: {
        winner: 'draw',
        reason: 'stalemate',
      },
    };
  }

  // Other draw conditions
  if (boardState.isDraw && boardState.drawReason) {
    return {
      isEnded: true,
      result: {
        winner: 'draw',
        reason: boardState.drawReason as GameEndReason,
      },
    };
  }

  return { isEnded: false, result: null };
}

/**
 * Creates a game result for resignation.
 */
export function createResignationResult(resigningColor: 'white' | 'black'): GameResult {
  return {
    winner: resigningColor === 'white' ? 'black' : 'white',
    reason: 'resignation',
  };
}

/**
 * Creates a game result for time loss.
 */
export function createTimeLossResult(losingColor: 'white' | 'black'): GameResult {
  return {
    winner: losingColor === 'white' ? 'black' : 'white',
    reason: 'time_loss',
  };
}

/**
 * Creates a game result for agreed draw.
 */
export function createAgreedDrawResult(): GameResult {
  return {
    winner: 'draw',
    reason: 'agreed_draw',
  };
}
