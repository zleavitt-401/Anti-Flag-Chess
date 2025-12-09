export type TimerCallback = (remainingMs: number) => void;
export type TimerExpiredCallback = () => void;

/**
 * Turn timer with start, stop, reset functionality.
 * Pure TypeScript - no browser/framework dependencies.
 */
export class TurnTimer {
  private durationMs: number;
  private remainingMs: number;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastTickAt: number = 0;
  private onTick: TimerCallback | null = null;
  private onExpired: TimerExpiredCallback | null = null;

  constructor(durationMs: number) {
    this.durationMs = durationMs;
    this.remainingMs = durationMs;
  }

  /**
   * Starts the timer countdown.
   */
  start(onTick?: TimerCallback, onExpired?: TimerExpiredCallback): void {
    if (this.intervalId !== null) {
      return; // Already running
    }

    this.onTick = onTick ?? null;
    this.onExpired = onExpired ?? null;
    this.lastTickAt = Date.now();

    this.intervalId = setInterval(() => {
      this.tick();
    }, 100); // Tick every 100ms for smooth countdown
  }

  /**
   * Stops the timer without resetting.
   */
  stop(): number {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    // Update remaining time one last time
    const now = Date.now();
    const elapsed = now - this.lastTickAt;
    this.remainingMs = Math.max(0, this.remainingMs - elapsed);
    this.lastTickAt = now;
    return this.remainingMs;
  }

  /**
   * Resets the timer to initial duration.
   */
  reset(): void {
    this.stop();
    this.remainingMs = this.durationMs;
  }

  /**
   * Sets a new duration and resets.
   */
  setDuration(durationMs: number): void {
    this.durationMs = durationMs;
    this.reset();
  }

  /**
   * Gets remaining time in milliseconds.
   */
  getRemainingMs(): number {
    if (this.intervalId !== null) {
      const elapsed = Date.now() - this.lastTickAt;
      return Math.max(0, this.remainingMs - elapsed);
    }
    return this.remainingMs;
  }

  /**
   * Sets remaining time (for syncing with server state).
   */
  setRemainingMs(ms: number): void {
    this.remainingMs = Math.max(0, ms);
    this.lastTickAt = Date.now();
  }

  /**
   * Checks if timer is currently running.
   */
  isRunning(): boolean {
    return this.intervalId !== null;
  }

  /**
   * Checks if timer has expired.
   */
  isExpired(): boolean {
    return this.getRemainingMs() <= 0;
  }

  private tick(): void {
    const now = Date.now();
    const elapsed = now - this.lastTickAt;
    this.lastTickAt = now;
    this.remainingMs = Math.max(0, this.remainingMs - elapsed);

    if (this.onTick) {
      this.onTick(this.remainingMs);
    }

    if (this.remainingMs <= 0) {
      this.stop();
      if (this.onExpired) {
        this.onExpired();
      }
    }
  }
}
