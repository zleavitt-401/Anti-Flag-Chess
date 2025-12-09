import { TurnTimer, TimerCallback, TimerExpiredCallback } from './turn-timer.js';

/**
 * Grace period timer that triggers after turn time expires.
 * Reuses TurnTimer functionality with grace-specific semantics.
 */
export class GracePeriodTimer {
  private timer: TurnTimer;
  private isActive: boolean = false;

  constructor(gracePeriodMs: number) {
    this.timer = new TurnTimer(gracePeriodMs);
  }

  /**
   * Starts the grace period countdown.
   */
  start(onTick?: TimerCallback, onExpired?: TimerExpiredCallback): void {
    this.isActive = true;
    this.timer.reset();
    this.timer.start(onTick, () => {
      this.isActive = false;
      if (onExpired) {
        onExpired();
      }
    });
  }

  /**
   * Stops the grace period (e.g., player made a move).
   */
  stop(): void {
    this.isActive = false;
    this.timer.stop();
  }

  /**
   * Resets the grace period timer.
   */
  reset(): void {
    this.isActive = false;
    this.timer.reset();
  }

  /**
   * Sets a new grace period duration.
   */
  setDuration(gracePeriodMs: number): void {
    this.timer.setDuration(gracePeriodMs);
    this.isActive = false;
  }

  /**
   * Gets remaining grace time in milliseconds.
   */
  getRemainingMs(): number {
    return this.isActive ? this.timer.getRemainingMs() : 0;
  }

  /**
   * Checks if grace period is currently active.
   */
  isGracePeriodActive(): boolean {
    return this.isActive && this.timer.isRunning();
  }

  /**
   * Checks if grace period has expired.
   */
  hasExpired(): boolean {
    return this.isActive && this.timer.isExpired();
  }
}
