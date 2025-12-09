'use client';

import { useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import { useGameStore } from '@/lib/store/game-store';

interface MakeMoveResponse {
  success?: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export function useMakeMove(socket: Socket | null, gameId: string | null) {
  const { setError } = useGameStore();

  const makeMove = useCallback(
    (move: string): void => {
      if (!socket || !socket.connected || !gameId) {
        setError('Not connected to server');
        return;
      }

      socket.emit('make_move', { gameId, move }, (response: MakeMoveResponse) => {
        if (response.error) {
          console.error('Move error:', response.error);
          // Don't show error to user for invalid moves - just ignore
        }
      });
    },
    [socket, gameId, setError]
  );

  return { makeMove };
}
