'use client';

import { useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import { useGameStore } from '@/lib/store/game-store';

interface ResignResponse {
  success?: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export function useResign(socket: Socket | null, gameId: string | null) {
  const { setError } = useGameStore();

  const resign = useCallback(() => {
    if (!socket || !socket.connected || !gameId) {
      setError('Not connected to server');
      return;
    }

    socket.emit('resign', { gameId }, (response: ResignResponse) => {
      if (response.error) {
        console.error('Resign error:', response.error);
        setError(response.error.message);
      }
    });
  }, [socket, gameId, setError]);

  return { resign };
}
