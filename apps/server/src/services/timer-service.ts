import type { Server } from 'socket.io';
import { TimerController, type TimerEvent } from '@anti-flag-chess/core';
import type { GameStore, StoredGame } from './game-store.js';
import { GameRoom } from '../rooms/game-room.js';

/**
 * Server-side timer service managing game timers.
 */
export class TimerService {
  private io: Server;
  private gameStore: GameStore;
  private timers: Map<string, TimerController> = new Map();
  private syncIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private onGraceExpired: (gameId: string, player: 'white' | 'black') => void;

  constructor(
    io: Server,
    gameStore: GameStore,
    onGraceExpired: (gameId: string, player: 'white' | 'black') => void
  ) {
    this.io = io;
    this.gameStore = gameStore;
    this.onGraceExpired = onGraceExpired;
  }

  /**
   * Starts timers for a game.
   */
  startGame(gameId: string, turnTimeSeconds: number, gracePeriodSeconds: number): void {
    // Create timer controller
    const controller = new TimerController(turnTimeSeconds, gracePeriodSeconds);

    // Set up event callback
    controller.onEvent((event: TimerEvent) => {
      this.handleTimerEvent(gameId, event);
    });

    this.timers.set(gameId, controller);

    // Start the game
    controller.startGame();

    // Start periodic sync
    this.startSync(gameId);
  }

  /**
   * Handles a move being made - switches timers.
   */
  onMoveMade(gameId: string): void {
    const controller = this.timers.get(gameId);
    if (controller) {
      controller.onMoveMade();
    }
  }

  /**
   * Stops all timers for a game.
   */
  stopGame(gameId: string): void {
    const controller = this.timers.get(gameId);
    if (controller) {
      controller.stopAll();
      this.timers.delete(gameId);
    }

    const syncInterval = this.syncIntervals.get(gameId);
    if (syncInterval) {
      clearInterval(syncInterval);
      this.syncIntervals.delete(gameId);
    }
  }

  /**
   * Gets timer state for a game.
   */
  getTimerState(gameId: string) {
    const controller = this.timers.get(gameId);
    return controller?.getTimerState() ?? null;
  }

  private handleTimerEvent(gameId: string, event: TimerEvent): void {
    const room = new GameRoom(this.io, gameId, this.gameStore, null!);

    switch (event.type) {
      case 'grace_started':
        room.broadcastGraceStarted(event.player, event.timerState.graceTimeRemaining);
        break;

      case 'grace_expired':
        this.onGraceExpired(gameId, event.player);
        break;

      case 'tick':
        // Handled by periodic sync
        break;

      case 'turn_expired':
        // Grace period will follow
        break;
    }
  }

  private startSync(gameId: string): void {
    const syncInterval = setInterval(() => {
      const controller = this.timers.get(gameId);
      if (!controller) {
        clearInterval(syncInterval);
        this.syncIntervals.delete(gameId);
        return;
      }

      const timerState = controller.getTimerState();
      if (!timerState.activePlayer) {
        return; // Game not active
      }

      const room = new GameRoom(this.io, gameId, this.gameStore, null!);
      room.broadcastTimerSync(
        timerState.whiteTimeRemaining,
        timerState.blackTimeRemaining,
        timerState.activePlayer,
        Date.now()
      );
    }, 100); // Sync every 100ms

    this.syncIntervals.set(gameId, syncInterval);
  }
}
