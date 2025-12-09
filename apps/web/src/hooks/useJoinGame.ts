'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import type { GameSettings, BoardState, TimerState } from '@anti-flag-chess/core';
import { useGameStore } from '@/lib/store/game-store';

interface JoinGameResponse {
  gameId: string;
  playerColor: 'white' | 'black';
  opponentConnected: boolean;
  settings: GameSettings;
}

interface JoinGameError {
  error: {
    code: string;
    message: string;
  };
}

interface GameStartEvent {
  gameId: string;
  boardState: BoardState;
  timers: TimerState;
  whiteSessionId: string;
  blackSessionId: string;
}

export function useJoinGame(socket: Socket | null, gameId: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    setGameId,
    setSettings,
    setPlayerColor,
    setOpponentConnected,
    setBoardState,
    setTimerState,
    setStatus,
    setError,
    status,
  } = useGameStore();

  // Listen for game_start event
  useEffect(() => {
    if (!socket) return;

    const handleGameStart = (event: GameStartEvent) => {
      console.log('Game started:', event);
      setBoardState(event.boardState);
      setTimerState(event.timers);
      setStatus('active');
    };

    socket.on('game_start', handleGameStart);

    return () => {
      socket.off('game_start', handleGameStart);
    };
  }, [socket, setBoardState, setTimerState, setStatus]);

  const joinGame = useCallback(async (): Promise<JoinGameResponse | null> => {
    if (!socket || !socket.connected || !gameId) {
      setError('Not connected to server');
      return null;
    }

    // Don't join if already in a different status
    if (status !== 'idle' && status !== 'joining') {
      return null;
    }

    setIsLoading(true);
    setStatus('joining');
    setError(null);

    return new Promise((resolve) => {
      socket.emit('join_game', { gameId }, (response: JoinGameResponse | JoinGameError) => {
        setIsLoading(false);

        if ('error' in response) {
          setError(response.error.message);
          setStatus('error');
          resolve(null);
          return;
        }

        setGameId(response.gameId);
        setSettings(response.settings);
        setPlayerColor(response.playerColor);
        setOpponentConnected(response.opponentConnected);
        // Status will be set to 'active' when game_start is received

        resolve(response);
      });
    });
  }, [socket, gameId, status, setGameId, setSettings, setPlayerColor, setOpponentConnected, setStatus, setError]);

  return {
    joinGame,
    isLoading,
  };
}
