'use client';

import { useEffect, useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import { useGameStore } from '@/lib/store/game-store';

interface TimerSyncEvent {
  whiteTimeRemaining: number;
  blackTimeRemaining: number;
  activePlayer: 'white' | 'black';
  serverTime: number;
  isGracePeriod: boolean;
  graceTimeRemaining: number;
}

export function useTimerSync(socket: Socket | null) {
  const { setTimerState } = useGameStore();

  const handleTimerSync = useCallback(
    (event: TimerSyncEvent) => {
      setTimerState({
        whiteTimeRemaining: event.whiteTimeRemaining,
        blackTimeRemaining: event.blackTimeRemaining,
        activePlayer: event.activePlayer,
        isGracePeriod: event.isGracePeriod,
        graceTimeRemaining: event.graceTimeRemaining,
        lastSyncAt: event.serverTime,
      });
    },
    [setTimerState]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on('timer_sync', handleTimerSync);

    return () => {
      socket.off('timer_sync', handleTimerSync);
    };
  }, [socket, handleTimerSync]);
}
