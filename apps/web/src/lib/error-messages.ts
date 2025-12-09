/**
 * Human-readable error messages for WebSocket error codes.
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // Session errors
  NO_SESSION: 'Session not found. Please refresh the page.',

  // Game errors
  GAME_NOT_FOUND: 'Game not found. It may have expired or been deleted.',
  GAME_NOT_ACTIVE: 'This game is not currently active.',
  GAME_ALREADY_STARTED: 'This game has already started.',
  GAME_FULL: 'This game already has two players.',
  GAME_ENDED: 'This game has already ended.',

  // Player errors
  NOT_IN_GAME: 'You are not a player in this game.',
  NOT_YOUR_TURN: "It's not your turn to move.",

  // Move errors
  INVALID_MOVE: 'That move is not valid.',
  MOVE_FAILED: 'Failed to execute the move. Please try again.',

  // Draw errors
  DRAW_ALREADY_OFFERED: 'A draw offer is already pending.',
  NO_DRAW_OFFER: 'There is no pending draw offer to respond to.',
  CANT_RESPOND_OWN: 'You cannot respond to your own draw offer.',

  // Connection errors
  CONNECTION_LOST: 'Lost connection to server. Attempting to reconnect...',
  CONNECTION_FAILED: 'Failed to connect to server. Please check your internet connection.',
};

/**
 * Gets a human-readable error message for a given error code.
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || `An error occurred: ${code}`;
}
