import { create } from 'zustand';
import {
  TimerSession,
  TimerConfiguration,
  PlayerTimer,
  PlayerColor,
  SessionPhase,
  SoundType,
  createDefaultSession,
  createPlayerTimer,
  WARNING_THRESHOLD_MS,
  PULSE_THRESHOLD_MS,
} from '../types/irl-timer';

export interface IRLTimerStore {
  // State
  session: TimerSession;

  // Configuration actions
  setTurnTime: (seconds: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundType: (type: SoundType) => void;

  // Game flow actions
  startGame: () => void;
  switchTurn: () => void;
  pause: () => void;
  resume: () => void;
  endGame: () => void;
  playAgain: () => void;
  backToSetup: () => void;

  // Timer tick (called by interval)
  tick: (elapsedMs: number) => void;

  // Derived getters
  getActiveTimer: () => PlayerTimer;
  getInactiveTimer: () => PlayerTimer;
  isWarningTime: () => boolean;
  isPulseTime: () => boolean;
}

export const useIRLTimerStore = create<IRLTimerStore>((set, get) => ({
  session: createDefaultSession(),

  setTurnTime: (seconds: number) => {
    set((state) => ({
      session: {
        ...state.session,
        config: {
          ...state.session.config,
          turnTimeSeconds: seconds,
        },
      },
    }));
  },

  setSoundEnabled: (enabled: boolean) => {
    set((state) => ({
      session: {
        ...state.session,
        config: {
          ...state.session.config,
          soundEnabled: enabled,
        },
      },
    }));
  },

  setSoundType: (type: SoundType) => {
    set((state) => ({
      session: {
        ...state.session,
        config: {
          ...state.session.config,
          soundType: type,
        },
      },
    }));
  },

  startGame: () => {
    const { session } = get();
    const turnTimeMs = session.config.turnTimeSeconds * 1000;

    set({
      session: {
        ...session,
        phase: 'playing',
        white: createPlayerTimer('white', turnTimeMs),
        black: createPlayerTimer('black', turnTimeMs),
        activePlayer: 'white',
        startedAt: Date.now(),
        endedAt: null,
      },
    });
  },

  switchTurn: () => {
    set((state) => {
      const { session } = state;
      const turnTimeMs = session.config.turnTimeSeconds * 1000;
      const currentPlayer = session.activePlayer;
      const nextPlayer: PlayerColor = currentPlayer === 'white' ? 'black' : 'white';

      // Calculate time used by current player this turn
      const currentTimer = session[currentPlayer];
      const timeUsedThisTurn = turnTimeMs - currentTimer.remainingMs;

      // Get next player's timer - reset if it was expired
      const nextTimer = session[nextPlayer];
      const nextRemainingMs = nextTimer.expired ? turnTimeMs : nextTimer.remainingMs;

      return {
        session: {
          ...session,
          activePlayer: nextPlayer,
          [currentPlayer]: {
            ...currentTimer,
            totalUsedMs: currentTimer.totalUsedMs + timeUsedThisTurn,
            remainingMs: turnTimeMs, // Reset for next turn
            expired: false,
          },
          [nextPlayer]: {
            ...nextTimer,
            remainingMs: nextRemainingMs,
            expired: false,
          },
        },
      };
    });
  },

  pause: () => {
    set((state) => ({
      session: {
        ...state.session,
        phase: 'paused',
      },
    }));
  },

  resume: () => {
    set((state) => ({
      session: {
        ...state.session,
        phase: 'playing',
      },
    }));
  },

  endGame: () => {
    set((state) => ({
      session: {
        ...state.session,
        phase: 'ended',
        endedAt: Date.now(),
      },
    }));
  },

  playAgain: () => {
    const { session } = get();
    const turnTimeMs = session.config.turnTimeSeconds * 1000;

    set({
      session: {
        ...session,
        phase: 'playing',
        white: createPlayerTimer('white', turnTimeMs),
        black: createPlayerTimer('black', turnTimeMs),
        activePlayer: 'white',
        startedAt: Date.now(),
        endedAt: null,
      },
    });
  },

  backToSetup: () => {
    set({
      session: createDefaultSession(),
    });
  },

  tick: (elapsedMs: number) => {
    set((state) => {
      const { session } = state;
      if (session.phase !== 'playing') return state;

      const activePlayer = session.activePlayer;
      const activeTimer = session[activePlayer];
      const newRemainingMs = Math.max(0, activeTimer.remainingMs - elapsedMs);
      const expired = newRemainingMs === 0;

      return {
        session: {
          ...session,
          [activePlayer]: {
            ...activeTimer,
            remainingMs: newRemainingMs,
            expired,
          },
        },
      };
    });
  },

  getActiveTimer: () => {
    const { session } = get();
    return session[session.activePlayer];
  },

  getInactiveTimer: () => {
    const { session } = get();
    const inactivePlayer: PlayerColor =
      session.activePlayer === 'white' ? 'black' : 'white';
    return session[inactivePlayer];
  },

  isWarningTime: () => {
    const activeTimer = get().getActiveTimer();
    return activeTimer.remainingMs <= WARNING_THRESHOLD_MS && activeTimer.remainingMs > 0;
  },

  isPulseTime: () => {
    const activeTimer = get().getActiveTimer();
    return activeTimer.remainingMs <= PULSE_THRESHOLD_MS && activeTimer.remainingMs > 0;
  },
}));
