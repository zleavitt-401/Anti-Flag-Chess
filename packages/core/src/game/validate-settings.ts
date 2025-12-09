import type { GameSettings } from '../types/game-settings.js';
import { GAME_SETTINGS_CONSTRAINTS } from '../types/game-settings.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates game settings against constraints.
 */
export function validateGameSettings(settings: Partial<GameSettings>): ValidationResult {
  const errors: string[] = [];
  const { turnTimeSeconds, gracePeriodSeconds } = GAME_SETTINGS_CONSTRAINTS;

  // Validate turnTimeSeconds
  if (settings.turnTimeSeconds !== undefined) {
    if (!Number.isInteger(settings.turnTimeSeconds)) {
      errors.push('Turn time must be an integer');
    } else if (settings.turnTimeSeconds < turnTimeSeconds.min) {
      errors.push(`Turn time must be at least ${turnTimeSeconds.min} seconds`);
    } else if (settings.turnTimeSeconds > turnTimeSeconds.max) {
      errors.push(`Turn time must be at most ${turnTimeSeconds.max} seconds`);
    }
  }

  // Validate gracePeriodSeconds
  if (settings.gracePeriodSeconds !== undefined) {
    if (!Number.isInteger(settings.gracePeriodSeconds)) {
      errors.push('Grace period must be an integer');
    } else if (settings.gracePeriodSeconds < gracePeriodSeconds.min) {
      errors.push(`Grace period must be at least ${gracePeriodSeconds.min} seconds`);
    } else if (settings.gracePeriodSeconds > gracePeriodSeconds.max) {
      errors.push(`Grace period must be at most ${gracePeriodSeconds.max} seconds`);
    }
  }

  // Validate timeoutBehavior
  if (settings.timeoutBehavior !== undefined) {
    if (settings.timeoutBehavior !== 'auto_move' && settings.timeoutBehavior !== 'lose_on_time') {
      errors.push('Invalid timeout behavior');
    }
  }

  // Validate hostColor
  if (settings.hostColor !== undefined) {
    if (settings.hostColor !== 'white' && settings.hostColor !== 'black') {
      errors.push('Invalid host color');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that all required settings are present.
 */
export function validateCompleteSettings(settings: unknown): settings is GameSettings {
  if (typeof settings !== 'object' || settings === null) {
    return false;
  }

  const s = settings as Record<string, unknown>;

  return (
    typeof s.turnTimeSeconds === 'number' &&
    typeof s.gracePeriodSeconds === 'number' &&
    (s.timeoutBehavior === 'auto_move' || s.timeoutBehavior === 'lose_on_time') &&
    (s.hostColor === 'white' || s.hostColor === 'black')
  );
}
