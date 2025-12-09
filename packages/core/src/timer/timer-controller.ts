import { TurnTimer } from './turn-timer.js';
import { GracePeriodTimer } from './grace-timer.js';
import type { TimerState } from '../types/timer-state.js';

export type TimerEventType =
  | 'tick'
  | 'turn_expired'
  | 'grace_started'
  | 'grace_expired';

export interface TimerEvent {
  type: TimerEventType;
  player: 'white' | 'black';
  timerState: TimerState;
}

export type TimerEventCallback = (event: TimerEvent) => void;

/**
 * Orchestrates turn timers and grace periods for both players.
 * Server-authoritative timer management.
 */
export class TimerController {
  private turnTimeMs: number;
  private gracePeriodMs: number;
  private whiteTimer: TurnTimer;
  private blackTimer: TurnTimer;
  private graceTimer: GracePeriodTimer;
  private activePlayer: 'white' | 'black' | null = null;
  private eventCallback: TimerEventCallback | null = null;

  constructor(turnTimeSeconds: number, gracePeriodSeconds: number) {
    this.turnTimeMs = turnTimeSeconds * 1000;
    this.gracePeriodMs = gracePeriodSeconds * 1000;
    this.whiteTimer = new TurnTimer(this.turnTimeMs);
    this.blackTimer = new TurnTimer(this.turnTimeMs);
    this.graceTimer = new GracePeriodTimer(this.gracePeriodMs);
  }

  /**
   * Sets the event callback for timer events.
   */
  onEvent(callback: TimerEventCallback): void {
    this.eventCallback = callback;
  }

  /**
   * Starts the game - activates white's timer.
   */
  startGame(): void {
    this.activePlayer = 'white';
    this.whiteTimer.reset();
    this.blackTimer.reset();
    this.graceTimer.reset();

    this.whiteTimer.start(
      (remaining) => this.handleTick('white', remaining),
      () => this.handleTurnExpired('white')
    );
  }

  /**
   * Called when a player makes a move - switches active timer.
   */
  onMoveMade(): void {
    if (!this.activePlayer) return;

    // Stop current timer and grace period
    const currentTimer = this.activePlayer === 'white' ? this.whiteTimer : this.blackTimer;
    currentTimer.stop();
    this.graceTimer.stop();

    // Switch to other player
    this.activePlayer = this.activePlayer === 'white' ? 'black' : 'white';
    const nextTimer = this.activePlayer === 'white' ? this.whiteTimer : this.blackTimer;

    // Reset and start next player's timer
    nextTimer.reset();
    nextTimer.start(
      (remaining) => this.handleTick(this.activePlayer!, remaining),
      () => this.handleTurnExpired(this.activePlayer!)
    );
  }

  /**
   * Stops all timers (game ended).
   */
  stopAll(): void {
    this.whiteTimer.stop();
    this.blackTimer.stop();
    this.graceTimer.stop();
    this.activePlayer = null;
  }

  /**
   * Gets the current timer state.
   */
  getTimerState(): TimerState {
    return {
      whiteTimeRemaining: this.whiteTimer.getRemainingMs(),
      blackTimeRemaining: this.blackTimer.getRemainingMs(),
      activePlayer: this.activePlayer,
      isGracePeriod: this.graceTimer.isGracePeriodActive(),
      graceTimeRemaining: this.graceTimer.getRemainingMs(),
      lastSyncAt: Date.now(),
    };
  }

  /**
   * Sets timer state (for restoring from saved state).
   */
  setTimerState(state: TimerState): void {
    this.whiteTimer.setRemainingMs(state.whiteTimeRemaining);
    this.blackTimer.setRemainingMs(state.blackTimeRemaining);
    this.activePlayer = state.activePlayer;
  }

  /**
   * Gets the currently active player.
   */
  getActivePlayer(): 'white' | 'black' | null {
    return this.activePlayer;
  }

  private handleTick(player: 'white' | 'black', _remaining: number): void {
    if (this.eventCallback) {
      this.eventCallback({
        type: 'tick',
        player,
        timerState: this.getTimerState(),
      });
    }
  }

  private handleTurnExpired(player: 'white' | 'black'): void {
    if (this.eventCallback) {
      this.eventCallback({
        type: 'turn_expired',
        player,
        timerState: this.getTimerState(),
      });
    }

    // Start grace period if configured
    if (this.gracePeriodMs > 0) {
      this.graceTimer.start(
        () => this.handleGraceTick(player),
        () => this.handleGraceExpired(player)
      );

      if (this.eventCallback) {
        this.eventCallback({
          type: 'grace_started',
          player,
          timerState: this.getTimerState(),
        });
      }
    } else {
      // No grace period - immediately trigger grace expired
      this.handleGraceExpired(player);
    }
  }

  private handleGraceTick(player: 'white' | 'black'): void {
    if (this.eventCallback) {
      this.eventCallback({
        type: 'tick',
        player,
        timerState: this.getTimerState(),
      });
    }
  }

  private handleGraceExpired(player: 'white' | 'black'): void {
    if (this.eventCallback) {
      this.eventCallback({
        type: 'grace_expired',
        player,
        timerState: this.getTimerState(),
      });
    }
  }
}
