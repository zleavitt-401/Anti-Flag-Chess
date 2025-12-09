'use client';

import { useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import { useGameStore } from '@/lib/store/game-store';
import type { BoardState, Move, GameSettings, GameStatus, TimerState } from '@anti-flag-chess/core';

interface ActiveGameFoundEvent {
  gameId: string;
  gameState: {
    boardState: BoardState;
    moves: Move[];
    settings: GameSettings;
    status: GameStatus;
    timerState?: TimerState | null;
  };
  playerColor?: 'white' | 'black';
}

export function useReconnect(socket: Socket | null) {
  const {
    setGameId,
    setStatus,
    setBoardState,
    setMoves,
    setSettings,
    setTimerState,
    setPlayerColor,
    gameId: currentGameId,
  } = useGameStore();

  useEffect(() => {
    if (!socket) return;

    const handleActiveGameFound = (event: ActiveGameFoundEvent) => {
      console.log('Active game found:', event);

      // Only restore if we don't already have a game loaded
      if (currentGameId && currentGameId !== event.gameId) {
        console.log('Different game in progress, ignoring active game event');
        return;
      }

      setGameId(event.gameId);
      setBoardState(event.gameState.boardState);
      setMoves(event.gameState.moves);
      setSettings(event.gameState.settings);

      if (event.gameState.timerState) {
        setTimerState(event.gameState.timerState);
      }

      if (event.playerColor) {
        setPlayerColor(event.playerColor);
      }

      // Set status based on game state
      if (event.gameState.status === 'active') {
        setStatus('active');
      } else if (event.gameState.status === 'waiting') {
        setStatus('waiting');
      } else if (event.gameState.status === 'ended') {
        setStatus('ended');
      }
    };

    socket.on('active_game_found', handleActiveGameFound);

    return () => {
      socket.off('active_game_found', handleActiveGameFound);
    };
  }, [
    socket,
    currentGameId,
    setGameId,
    setStatus,
    setBoardState,
    setMoves,
    setSettings,
    setTimerState,
    setPlayerColor,
  ]);
}
