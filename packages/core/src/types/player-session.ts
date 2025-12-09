/**
 * Represents a player's connection to a game.
 */
export interface PlayerSession {
  /** Unique per browser session, stored in localStorage */
  sessionId: string;
  /** Current socket.io connection ID (null when disconnected) */
  socketId: string | null;
  /** Assigned color in this game */
  color: 'white' | 'black';
  /** Current connection status */
  isConnected: boolean;
  /** Unix timestamp ms of last activity */
  lastActivityAt: number;
}

/**
 * Creates a new player session.
 */
export function createPlayerSession(
  sessionId: string,
  socketId: string | null,
  color: 'white' | 'black'
): PlayerSession {
  return {
    sessionId,
    socketId,
    color,
    isConnected: socketId !== null,
    lastActivityAt: Date.now(),
  };
}
