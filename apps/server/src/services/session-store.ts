/**
 * Maps session IDs to game IDs for reconnection support.
 * Also tracks socket IDs to session IDs.
 */
export class SessionStore {
  /** sessionId → gameId */
  private sessionToGame: Map<string, string> = new Map();
  /** socketId → sessionId */
  private socketToSession: Map<string, string> = new Map();

  /**
   * Associates a session with a game.
   */
  setSessionGame(sessionId: string, gameId: string): void {
    this.sessionToGame.set(sessionId, gameId);
  }

  /**
   * Gets the game ID for a session.
   */
  getGameForSession(sessionId: string): string | undefined {
    return this.sessionToGame.get(sessionId);
  }

  /**
   * Removes a session's game association.
   */
  removeSession(sessionId: string): void {
    this.sessionToGame.delete(sessionId);
    // Also remove from socket mapping
    for (const [socketId, sid] of this.socketToSession.entries()) {
      if (sid === sessionId) {
        this.socketToSession.delete(socketId);
        break;
      }
    }
  }

  /**
   * Associates a socket with a session.
   */
  setSocketSession(socketId: string, sessionId: string): void {
    this.socketToSession.set(socketId, sessionId);
  }

  /**
   * Gets the session ID for a socket.
   */
  getSessionForSocket(socketId: string): string | undefined {
    return this.socketToSession.get(socketId);
  }

  /**
   * Removes a socket's session association.
   */
  removeSocket(socketId: string): void {
    this.socketToSession.delete(socketId);
  }

  /**
   * Gets the socket ID for a session (reverse lookup).
   */
  getSocketForSession(sessionId: string): string | undefined {
    for (const [socketId, sid] of this.socketToSession.entries()) {
      if (sid === sessionId) {
        return socketId;
      }
    }
    return undefined;
  }

  /**
   * Gets all sessions in a game.
   */
  getSessionsInGame(gameId: string): string[] {
    const sessions: string[] = [];
    for (const [sessionId, gid] of this.sessionToGame.entries()) {
      if (gid === gameId) {
        sessions.push(sessionId);
      }
    }
    return sessions;
  }
}
