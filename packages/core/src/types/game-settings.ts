/**
 * Configuration for timing rules, set at game creation.
 */
export interface GameSettings {
  /** Per-turn time limit in seconds (10-300) */
  turnTimeSeconds: number;
  /** Grace period duration in seconds (0-5) */
  gracePeriodSeconds: number;
  /** Behavior when time expires */
  timeoutBehavior: TimeoutBehavior;
  /** Host's chosen color */
  hostColor: 'white' | 'black';
}

export type TimeoutBehavior = 'auto_move' | 'lose_on_time';

/** Default game settings */
export const DEFAULT_GAME_SETTINGS: GameSettings = {
  turnTimeSeconds: 60,
  gracePeriodSeconds: 2,
  timeoutBehavior: 'auto_move',
  hostColor: 'white',
};

/** Validation constraints for game settings */
export const GAME_SETTINGS_CONSTRAINTS = {
  turnTimeSeconds: { min: 10, max: 300 },
  gracePeriodSeconds: { min: 0, max: 5 },
} as const;
