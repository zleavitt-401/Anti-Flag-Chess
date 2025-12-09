import { nanoid } from 'nanoid';

/**
 * Generates a unique game ID using nanoid.
 * Uses 12 characters for a good balance of brevity and collision resistance.
 */
export function generateGameId(): string {
  return nanoid(12);
}

/**
 * Validates a game ID format.
 */
export function isValidGameId(id: string): boolean {
  // nanoid uses URL-safe characters: A-Za-z0-9_-
  return /^[A-Za-z0-9_-]{12}$/.test(id);
}
