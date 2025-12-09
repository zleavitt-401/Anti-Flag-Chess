import type { StoredGame } from './game-store.js';

export interface MoveValidationResult {
  valid: boolean;
  error?: {
    code: 'INVALID_MOVE' | 'NOT_YOUR_TURN' | 'GAME_NOT_ACTIVE';
    message: string;
  };
}

/**
 * Validates a move against the current game state.
 */
export function validateMove(
  game: StoredGame,
  sessionId: string,
  move: string
): MoveValidationResult {
  // Check game is active
  if (game.status !== 'active') {
    return {
      valid: false,
      error: {
        code: 'GAME_NOT_ACTIVE',
        message: 'Game is not active',
      },
    };
  }

  // Check it's this player's turn
  const currentTurn = game.gameState.getCurrentTurn();
  const playerColor = game.players.white?.sessionId === sessionId
    ? 'white'
    : game.players.black?.sessionId === sessionId
      ? 'black'
      : null;

  if (!playerColor) {
    return {
      valid: false,
      error: {
        code: 'NOT_YOUR_TURN',
        message: 'You are not a player in this game',
      },
    };
  }

  if (playerColor !== currentTurn) {
    return {
      valid: false,
      error: {
        code: 'NOT_YOUR_TURN',
        message: `It is ${currentTurn}'s turn`,
      },
    };
  }

  // Check if move is legal
  if (!game.gameState.isLegalMove(move)) {
    return {
      valid: false,
      error: {
        code: 'INVALID_MOVE',
        message: 'Illegal move',
      },
    };
  }

  return { valid: true };
}
