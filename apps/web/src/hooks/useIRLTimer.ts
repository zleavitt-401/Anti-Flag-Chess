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
    switchTurn,
    getActiveTimer,
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

    tick(elapsed);

    // Check for auto-switch on expiry
    const activeTimer = getActiveTimer();
    if (activeTimer.remainingMs <= 0 && activeTimer.expired) {
      switchTurn();
    }

    // Play audio alert at each second boundary when in audio threshold
    if (session.config.soundEnabled && activeTimer.remainingMs <= AUDIO_THRESHOLD_MS) {
      const currentSecond = Math.ceil(activeTimer.remainingMs / 1000);
      if (currentSecond !== lastSecondRef.current && currentSecond > 0) {
        lastSecondRef.current = currentSecond;
        playSoundType(session.config.soundType);
      }
    }
  }, [tick, getActiveTimer, switchTurn, session.config.soundEnabled, session.config.soundType]);

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

  return {
    ...store,
    session,
    isWarningTime: warningTime,
    isPulseTime: pulseTime,
    activeTimer: getActiveTimer(),
  };
}
