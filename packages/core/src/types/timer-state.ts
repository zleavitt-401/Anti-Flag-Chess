/**
 * Real-time timing information managed server-side.
 */
export interface TimerState {
  /** Milliseconds remaining for white's current turn */
  whiteTimeRemaining: number;
  /** Milliseconds remaining for black's current turn */
  blackTimeRemaining: number;
  /** Whose timer is currently running (null if game not active) */
  activePlayer: 'white' | 'black' | null;
  /** True if currently in grace period */
  isGracePeriod: boolean;
  /** Milliseconds remaining in grace period (0 if not in grace) */
  graceTimeRemaining: number;
  /** Server timestamp of last sync */
  lastSyncAt: number;
}

/**
 * Creates initial timer state for a new game.
 */
export function createInitialTimerState(turnTimeMs: number): TimerState {
  return {
    whiteTimeRemaining: turnTimeMs,
    blackTimeRemaining: turnTimeMs,
    activePlayer: null,
    isGracePeriod: false,
    graceTimeRemaining: 0,
    lastSyncAt: Date.now(),
  };
}
