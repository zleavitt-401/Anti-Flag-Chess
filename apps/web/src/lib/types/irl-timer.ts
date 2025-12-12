/**
 * IRL Chess Timer Types
 * Client-side only data model for in-person chess timing
 */

export type PlayerColor = 'white' | 'black';

export type SessionPhase = 'setup' | 'playing' | 'paused' | 'ended';

/**
 * Technology-themed sound options for timer alerts
 */
export type SoundType =
  | 'digital-pulse'   // Short square wave burst
  | 'circuit-blip'    // Two-tone ascending blip
  | 'data-stream'     // Fast descending cascade
  | 'terminal-click'  // Sharp sawtooth click
  | 'cyber-ping';     // Sine wave with slight echo

export const SOUND_OPTIONS: { value: SoundType; label: string }[] = [
  { value: 'digital-pulse', label: 'Digital Pulse' },
  { value: 'circuit-blip', label: 'Circuit Blip' },
  { value: 'data-stream', label: 'Data Stream' },
  { value: 'terminal-click', label: 'Terminal Click' },
  { value: 'cyber-ping', label: 'Cyber Ping' },
];

/**
 * Timer configuration settings chosen on setup screen
 */
export interface TimerConfiguration {
  /** Time per turn in seconds (10-300) */
  turnTimeSeconds: number;
  /** Whether audio alerts are enabled */
  soundEnabled: boolean;
  /** Selected sound type for alerts */
  soundType: SoundType;
}

/**
 * Per-player timer state
 */
export interface PlayerTimer {
  /** Player color identifier */
  color: PlayerColor;
  /** Time remaining for current turn in milliseconds */
  remainingMs: number;
  /** Total time used across all turns in milliseconds */
  totalUsedMs: number;
  /** Whether this timer expired on the current/last turn */
  expired: boolean;
}

/**
 * Active timer session state
 */
export interface TimerSession {
  /** Current session phase */
  phase: SessionPhase;
  /** Active configuration (set on start) */
  config: TimerConfiguration;
  /** White player timer */
  white: PlayerTimer;
  /** Black player timer */
  black: PlayerTimer;
  /** Which player's turn is active */
  activePlayer: PlayerColor;
  /** Timestamp when session started (for summary) */
  startedAt: number | null;
  /** Timestamp when session ended */
  endedAt: number | null;
}

/**
 * Warning thresholds in milliseconds
 */
export const WARNING_THRESHOLD_MS = 10000; // 10 seconds
export const PULSE_THRESHOLD_MS = 5000;    // 5 seconds
export const AUDIO_THRESHOLD_MS = 3000;    // 3 seconds

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: TimerConfiguration = {
  turnTimeSeconds: 60, // 1 minute default
  soundEnabled: false,
  soundType: 'digital-pulse',
};

/**
 * Create a new player timer with initial values
 */
export function createPlayerTimer(color: PlayerColor, turnTimeMs: number): PlayerTimer {
  return {
    color,
    remainingMs: turnTimeMs,
    totalUsedMs: 0,
    expired: false,
  };
}

/**
 * Create default session state
 */
export function createDefaultSession(): TimerSession {
  const turnTimeMs = DEFAULT_CONFIG.turnTimeSeconds * 1000;
  return {
    phase: 'setup',
    config: { ...DEFAULT_CONFIG },
    white: createPlayerTimer('white', turnTimeMs),
    black: createPlayerTimer('black', turnTimeMs),
    activePlayer: 'white',
    startedAt: null,
    endedAt: null,
  };
}
