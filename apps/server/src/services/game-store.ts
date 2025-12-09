import type { Game, GameSettings, GameStatus, GameResult, PlayerSession } from '@anti-flag-chess/core';
import { GameState, createInitialTimerState, STARTING_FEN } from '@anti-flag-chess/core';

/**
 * Draw offer tracking.
 */
export interface DrawOffer {
  from: 'white' | 'black';
  offeredAt: number;
}

/**
 * Internal game representation with game state instance.
 */
export interface StoredGame extends Omit<Game, 'board'> {
  gameState: GameState;
  pendingDrawOffer: DrawOffer | null;
}

/**
 * In-memory game storage with Map-based implementation.
 * MVP storage - can be replaced with Redis for production.
 */
export class GameStore {
  private games: Map<string, StoredGame> = new Map();
  private cleanupIntervals: Map<string, ReturnType<typeof setTimeout>> = new Map();

  /**
   * Creates a new game with the given settings.
   */
  createGame(id: string, settings: GameSettings, hostSession: PlayerSession): StoredGame {
    const gameState = new GameState(STARTING_FEN);
    const now = Date.now();

    const game: StoredGame = {
      id,
      settings,
      status: 'waiting',
      gameState,
      moves: [],
      players: {
        white: settings.hostColor === 'white' ? hostSession : null,
        black: settings.hostColor === 'black' ? hostSession : null,
      },
      result: null,
      createdAt: now,
      startedAt: null,
      endedAt: null,
      pendingDrawOffer: null,
    };

    this.games.set(id, game);
    return game;
  }

  /**
   * Gets a game by ID.
   */
  getGame(id: string): StoredGame | undefined {
    return this.games.get(id);
  }

  /**
   * Updates a game.
   */
  updateGame(id: string, updates: Partial<StoredGame>): StoredGame | undefined {
    const game = this.games.get(id);
    if (!game) return undefined;

    const updated = { ...game, ...updates };
    this.games.set(id, updated);
    return updated;
  }

  /**
   * Adds a player to a game.
   */
  addPlayer(id: string, player: PlayerSession): StoredGame | undefined {
    const game = this.games.get(id);
    if (!game) return undefined;

    const color = player.color;
    game.players[color] = player;

    // If both players present, start the game
    if (game.players.white && game.players.black) {
      game.status = 'active';
      game.startedAt = Date.now();
    }

    this.games.set(id, game);
    return game;
  }

  /**
   * Updates a player's session in a game.
   */
  updatePlayer(gameId: string, sessionId: string, updates: Partial<PlayerSession>): StoredGame | undefined {
    const game = this.games.get(gameId);
    if (!game) return undefined;

    // Find which color this session belongs to
    for (const color of ['white', 'black'] as const) {
      const player = game.players[color];
      if (player && player.sessionId === sessionId) {
        game.players[color] = { ...player, ...updates };
        this.games.set(gameId, game);
        return game;
      }
    }

    return undefined;
  }

  /**
   * Ends a game with the given result.
   */
  endGame(id: string, result: GameResult): StoredGame | undefined {
    const game = this.games.get(id);
    if (!game) return undefined;

    game.status = 'ended';
    game.result = result;
    game.endedAt = Date.now();

    this.games.set(id, game);

    // Schedule cleanup after 5 minutes
    this.scheduleCleanup(id, 5 * 60 * 1000);

    return game;
  }

  /**
   * Sets a draw offer on a game.
   */
  setDrawOffer(id: string, from: 'white' | 'black'): StoredGame | undefined {
    const game = this.games.get(id);
    if (!game) return undefined;

    game.pendingDrawOffer = {
      from,
      offeredAt: Date.now(),
    };

    this.games.set(id, game);
    return game;
  }

  /**
   * Clears a draw offer from a game.
   */
  clearDrawOffer(id: string): StoredGame | undefined {
    const game = this.games.get(id);
    if (!game) return undefined;

    game.pendingDrawOffer = null;
    this.games.set(id, game);
    return game;
  }

  /**
   * Deletes a game.
   */
  deleteGame(id: string): boolean {
    this.cancelCleanup(id);
    return this.games.delete(id);
  }

  /**
   * Gets all active games count.
   */
  getActiveGameCount(): number {
    let count = 0;
    for (const game of this.games.values()) {
      if (game.status === 'active') count++;
    }
    return count;
  }

  /**
   * Gets total games count.
   */
  getTotalGameCount(): number {
    return this.games.size;
  }

  /**
   * Schedules game cleanup after delay.
   */
  private scheduleCleanup(id: string, delayMs: number): void {
    this.cancelCleanup(id);
    const timeout = setTimeout(() => {
      this.games.delete(id);
      this.cleanupIntervals.delete(id);
    }, delayMs);
    this.cleanupIntervals.set(id, timeout);
  }

  /**
   * Cancels scheduled cleanup.
   */
  private cancelCleanup(id: string): void {
    const timeout = this.cleanupIntervals.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.cleanupIntervals.delete(id);
    }
  }
}
