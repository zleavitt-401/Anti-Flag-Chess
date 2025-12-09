const SESSION_KEY = 'anti-flag-chess-session-id';

/**
 * Generates a random session ID.
 */
function generateSessionId(): string {
  // Use crypto.randomUUID if available, otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Gets the session ID, creating one if it doesn't exist.
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side: return a placeholder
    return 'server-side';
  }

  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Gets the session ID if it exists, null otherwise.
 */
export function getExistingSessionId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(SESSION_KEY);
}

/**
 * Clears the session ID.
 */
export function clearSessionId(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(SESSION_KEY);
}
