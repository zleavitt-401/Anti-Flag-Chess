'use client';

import { useCallback, useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import { useGameStore } from '@/lib/store/game-store';

interface DrawResponse {
  success?: boolean;
  error?: {
    code: string;
    message: string;
  };
}

interface DrawOfferedEvent {
  from: 'white' | 'black';
}

export function useDrawOffer(socket: Socket | null, gameId: string | null) {
  const { setError, setPendingDrawOffer, pendingDrawOffer } = useGameStore();

  // Listen for draw_offered and draw_declined events
  useEffect(() => {
    if (!socket) return;

    const handleDrawOffered = (event: DrawOfferedEvent) => {
      setPendingDrawOffer({ from: event.from });
    };

    const handleDrawDeclined = () => {
      setPendingDrawOffer(null);
    };

    socket.on('draw_offered', handleDrawOffered);
    socket.on('draw_declined', handleDrawDeclined);

    return () => {
      socket.off('draw_offered', handleDrawOffered);
      socket.off('draw_declined', handleDrawDeclined);
    };
  }, [socket, setPendingDrawOffer]);

  const offerDraw = useCallback(() => {
    if (!socket || !socket.connected || !gameId) {
      setError('Not connected to server');
      return;
    }

    socket.emit('offer_draw', { gameId }, (response: DrawResponse) => {
      if (response.error) {
        console.error('Draw offer error:', response.error);
        setError(response.error.message);
      }
    });
  }, [socket, gameId, setError]);

  const respondToDraw = useCallback(
    (accept: boolean) => {
      if (!socket || !socket.connected || !gameId) {
        setError('Not connected to server');
        return;
      }

      socket.emit('respond_draw', { gameId, accept }, (response: DrawResponse) => {
        if (response.error) {
          console.error('Draw response error:', response.error);
          setError(response.error.message);
        }
        // Clear pending draw offer after responding
        setPendingDrawOffer(null);
      });
    },
    [socket, gameId, setError, setPendingDrawOffer]
  );

  return { offerDraw, respondToDraw, pendingDrawOffer };
}
