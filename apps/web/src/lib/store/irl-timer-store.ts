import { create } from 'zustand';
import {
  TimerSession,
  TimerConfiguration,
  PlayerTimer,
  PlayerColor,
  SessionPhase,
  SoundType,
  TimeoutBehavior,
  GracePeriodSeconds,
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
  setGracePeriod: (seconds: GracePeriodSeconds) => void;
  setTimeoutBehavior: (behavior: TimeoutBehavior) => void;

  // Game flow actions
  startGame: () => void;
  switchTurn: () => void;
  pause: () => void;
  resume: () => void;
  endGame: () => void;
  playAgain: () => void;
  backToSetup: () => void;

  // Grace period actions
  enterGracePeriod: () => void;
  exitGracePeriod: () => void;
  tickGrace: (elapsedMs: number) => void;
  pauseWithTimeout: () => void;

  // Timer tick (called by interval)
  tick: (elapsedMs: number) => void;

  // Derived getters
  getActiveTimer: () => PlayerTimer;
  getInactiveTimer: () => PlayerTimer;
  isWarningTime: () => boolean;
  isPulseTime: () => boolean;
  getGraceProgress: () => number;
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

  setGracePeriod: (seconds: GracePeriodSeconds) => {
    set((state) => ({
      session: {
        ...state.session,
        config: {
          ...state.session.config,
          gracePeriodSeconds: seconds,
        },
      },
    }));
  },

  setTimeoutBehavior: (behavior: TimeoutBehavior) => {
    set((state) => ({
      session: {
        ...state.session,
        config: {
          ...state.session.config,
          timeoutBehavior: behavior,
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
        isInGracePeriod: false,
        graceElapsedMs: 0,
        graceTriggerPlayer: null,
        timeoutContext: null,
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
      // If in grace period, count as full turn time (timer went to 0)
      const currentTimer = session[currentPlayer];
      const timeUsedThisTurn = session.isInGracePeriod
        ? turnTimeMs
        : turnTimeMs - currentTimer.remainingMs;

      // Get next player's timer - reset if it was expired
      const nextTimer = session[nextPlayer];
      const nextRemainingMs = nextTimer.expired ? turnTimeMs : nextTimer.remainingMs;

      return {
        session: {
          ...session,
          activePlayer: nextPlayer,
          // Clear grace period state on switch
          isInGracePeriod: false,
          graceElapsedMs: 0,
          graceTriggerPlayer: null,
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
        // Clear grace period state if pausing during grace
        isInGracePeriod: false,
        graceElapsedMs: 0,
        graceTriggerPlayer: null,
      },
    }));
  },

  resume: () => {
    set((state) => {
      const { session } = state;
      const turnTimeMs = session.config.turnTimeSeconds * 1000;

      // If resuming from a timeout pause, switch to the other player
      if (session.timeoutContext) {
        const expiredPlayer = session.timeoutContext.expiredPlayer;
        const nextPlayer = expiredPlayer === 'white' ? 'black' : 'white';
        const expiredTimer = session[expiredPlayer];
        const nextTimer = session[nextPlayer];

        return {
          session: {
            ...session,
            phase: 'playing',
            activePlayer: nextPlayer,
            timeoutContext: null,
            [expiredPlayer]: {
              ...expiredTimer,
              remainingMs: turnTimeMs, // Reset expired player's timer for their next turn
              expired: false,
            },
            [nextPlayer]: {
              ...nextTimer,
              remainingMs: turnTimeMs, // Reset next player's timer - it's the start of their turn
              expired: false,
            },
          },
        };
      }

      // Normal resume
      return {
        session: {
          ...session,
          phase: 'playing',
        },
      };
    });
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
        isInGracePeriod: false,
        graceElapsedMs: 0,
        graceTriggerPlayer: null,
        timeoutContext: null,
      },
    });
  },

  backToSetup: () => {
    set({
      session: createDefaultSession(),
    });
  },

  enterGracePeriod: () => {
    set((state) => ({
      session: {
        ...state.session,
        isInGracePeriod: true,
        graceElapsedMs: 0,
        graceTriggerPlayer: state.session.activePlayer,
      },
    }));
  },

  exitGracePeriod: () => {
    set((state) => ({
      session: {
        ...state.session,
        isInGracePeriod: false,
        graceElapsedMs: 0,
        graceTriggerPlayer: null,
      },
    }));
  },

  tickGrace: (elapsedMs: number) => {
    set((state) => {
      if (!state.session.isInGracePeriod) return state;
      return {
        session: {
          ...state.session,
          graceElapsedMs: state.session.graceElapsedMs + elapsedMs,
        },
      };
    });
  },

  pauseWithTimeout: () => {
    set((state) => ({
      session: {
        ...state.session,
        phase: 'paused',
        isInGracePeriod: false,
        graceElapsedMs: 0,
        timeoutContext: state.session.graceTriggerPlayer
          ? { expiredPlayer: state.session.graceTriggerPlayer }
          : null,
        graceTriggerPlayer: null,
      },
    }));
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

  getGraceProgress: () => {
    const { session } = get();
    if (!session.isInGracePeriod) return 0;
    const gracePeriodMs = session.config.gracePeriodSeconds * 1000;
    return Math.min(1, session.graceElapsedMs / gracePeriodMs);
  },
}));
