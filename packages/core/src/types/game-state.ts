import type { GameSettings } from './game-settings.js';
import type { BoardState } from './board-state.js';
import type { Move } from './move.js';
import type { PlayerSession } from './player-session.js';

/**
 * Current lifecycle state of a game.
 */
export type GameStatus = 'waiting' | 'active' | 'ended';

/**
 * Reason for game ending.
 */
export type GameEndReason =
  | 'checkmate'
  | 'stalemate'
  | 'resignation'
  | 'agreed_draw'
  | 'time_loss'
  | 'threefold_repetition'
  | 'fifty_move_rule'
  | 'insufficient_material';

/**
 * Result of a completed game.
 */
export interface GameResult {
  winner: 'white' | 'black' | 'draw';
  reason: GameEndReason;
}

/**
 * Complete game state representation.
 */
export interface Game {
  /** Unique game identifier */
  id: string;
  /** Timing configuration */
  settings: GameSettings;
  /** Current lifecycle state */
  status: GameStatus;
  /** Current chess position */
  board: BoardState;
  /** Move history */
  moves: Move[];
  /** Player sessions */
  players: {
    white: PlayerSession | null;
    black: PlayerSession | null;
  };
  /** Game result (only when status is 'ended') */
  result: GameResult | null;
  /** Unix timestamp ms - game creation */
  createdAt: number;
  /** Unix timestamp ms - when both players joined */
  startedAt: number | null;
  /** Unix timestamp ms - when game concluded */
  endedAt: number | null;
}
