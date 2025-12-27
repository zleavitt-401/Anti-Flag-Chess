'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useIRLTimerStore } from '../lib/store/irl-timer-store';
import { AUDIO_THRESHOLD_MS } from '../lib/types/irl-timer';
import { playSoundType } from '../lib/audio/beep';

const TICK_INTERVAL_MS = 100;

/**
 * Hook to manage IRL timer countdown logic
 * Integrates TurnTimer-style logic with Zustand store
 */
export function useIRLTimer() {
  const store = useIRLTimerStore();
  const {
    session,
    tick,
    tickGrace,
    switchTurn,
    enterGracePeriod,
    exitGracePeriod,
    pauseWithTimeout,
    getActiveTimer,
    getGraceProgress,
    isWarningTime,
    isPulseTime,
  } = store;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(0);
  const lastSecondRef = useRef<number>(-1);

  // Handle timer tick
  const handleTick = useCallback(() => {
    const now = Date.now();
    const elapsed = now - lastTickRef.current;
    lastTickRef.current = now;

    // Read FRESH state from store to avoid stale closure issues
    // This is critical for resume behavior - closure session would have old timer values
    const currentSession = useIRLTimerStore.getState().session;
    const activeTimer = currentSession[currentSession.activePlayer];

    // If in grace period, tick grace timer instead of main timer
    if (currentSession.isInGracePeriod) {
      tickGrace(elapsed);

      // Check if grace period has expired
      const gracePeriodMs = currentSession.config.gracePeriodSeconds * 1000;
      if (currentSession.graceElapsedMs + elapsed >= gracePeriodMs) {
        exitGracePeriod();
        if (currentSession.config.timeoutBehavior === 'continue') {
          switchTurn();
        } else {
          pauseWithTimeout();
        }
      }
      return;
    }

    // Normal tick
    tick(elapsed);

    // Check if timer hit zero - enter grace period
    if (activeTimer.remainingMs <= elapsed && !currentSession.isInGracePeriod) {
      enterGracePeriod();
      return;
    }

    // Play audio alert at each second boundary when in audio threshold
    if (currentSession.config.soundEnabled && activeTimer.remainingMs <= AUDIO_THRESHOLD_MS) {
      const currentSecond = Math.ceil((activeTimer.remainingMs - elapsed) / 1000);
      if (currentSecond !== lastSecondRef.current && currentSecond > 0) {
        lastSecondRef.current = currentSecond;
        playSoundType(currentSession.config.soundType);
      }
    }
  }, [
    tick,
    tickGrace,
    switchTurn,
    enterGracePeriod,
    exitGracePeriod,
    pauseWithTimeout,
  ]);

  // Start/stop interval based on phase
  useEffect(() => {
    if (session.phase === 'playing') {
      lastTickRef.current = Date.now();
      lastSecondRef.current = -1;
      intervalRef.current = setInterval(handleTick, TICK_INTERVAL_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [session.phase, handleTick]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && session.phase === 'playing') {
        store.pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session.phase, store]);

  // Compute derived values (call the functions)
  const warningTime = isWarningTime();
  const pulseTime = isPulseTime();
  const graceProgress = getGraceProgress();

  return {
    ...store,
    session,
    isWarningTime: warningTime,
    isPulseTime: pulseTime,
    graceProgress,
    activeTimer: getActiveTimer(),
  };
}
