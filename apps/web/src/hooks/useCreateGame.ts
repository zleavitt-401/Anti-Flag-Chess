'use client';

import { useState, useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import type { GameSettings } from '@anti-flag-chess/core';
import { useGameStore } from '@/lib/store/game-store';

interface CreateGameResponse {
  gameId: string;
  inviteLink: string;
  settings: GameSettings;
  hostColor: 'white' | 'black';
}

interface CreateGameError {
  error: {
    code: string;
    message: string;
  };
}

export function useCreateGame(socket: Socket | null) {
  const [isLoading, setIsLoading] = useState(false);
  const { setGameId, setSettings, setPlayerColor, setInviteLink, setStatus, setError } = useGameStore();

  const createGame = useCallback(
    async (settings: GameSettings): Promise<CreateGameResponse | null> => {
      if (!socket || !socket.connected) {
        setError('Not connected to server');
        return null;
      }

      setIsLoading(true);
      setStatus('creating');
      setError(null);

      return new Promise((resolve) => {
        socket.emit('create_game', { settings }, (response: CreateGameResponse | CreateGameError) => {
          setIsLoading(false);

          if ('error' in response) {
            setError(response.error.message);
            setStatus('error');
            resolve(null);
            return;
          }

          setGameId(response.gameId);
          setSettings(response.settings);
          setPlayerColor(response.hostColor);
          setInviteLink(response.inviteLink);
          setStatus('waiting');

          resolve(response);
        });
      });
    },
    [socket, setGameId, setSettings, setPlayerColor, setInviteLink, setStatus, setError]
  );

  return {
    createGame,
    isLoading,
  };
}
