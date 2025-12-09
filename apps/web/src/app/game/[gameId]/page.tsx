'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useSocket, useSocketEvent } from '@/hooks/useSocket';
import { useJoinGame } from '@/hooks/useJoinGame';
import { useGameStore } from '@/lib/store/game-store';
import { WaitingLobby } from '@/components/waiting-lobby';
import { GameError } from '@/components/game-error';
import { GameStarting } from '@/components/game-starting';
import { ActiveGame } from '@/components/active-game';
import { ConnectionStatus } from '@/components/connection-status';
import { useReconnect } from '@/hooks/useReconnect';
import type { BoardState, TimerState } from '@anti-flag-chess/core';

interface GameStartEvent {
  gameId: string;
  boardState: BoardState;
  timers: TimerState;
  whiteSessionId: string;
  blackSessionId: string;
}

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const { socket, isConnected } = useSocket();
  const { joinGame, isLoading: isJoining } = useJoinGame(socket, gameId);
  const joinAttempted = useRef(false);
  const {
    status,
    settings,
    playerColor,
    inviteLink,
    error,
    boardState,
    gameId: storeGameId,
    setGameId,
    setStatus,
    setBoardState,
    setTimerState,
  } = useGameStore();

  // Use reconnect hook to handle active_game_found events
  useReconnect(socket);

  // Listen for game_start event (for the host when opponent joins)
  useSocketEvent<GameStartEvent>(socket, 'game_start', (event) => {
    console.log('Game started:', event);
    setBoardState(event.boardState);
    setTimerState(event.timers);
    setStatus('active');
  });

  // Handle joining when arriving via invite link
  useEffect(() => {
    if (!isConnected || !socket || joinAttempted.current) return;

    // If we're idle and have a gameId, try to join
    if (status === 'idle' && gameId && gameId !== storeGameId) {
      setGameId(gameId);
      joinAttempted.current = true;
      joinGame();
    }
  }, [isConnected, socket, status, gameId, storeGameId, setGameId, joinGame]);

  // Loading state
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Connecting to server...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error' || error) {
    return <GameError message={error || 'An error occurred'} />;
  }

  // Waiting for opponent (host view)
  if (status === 'waiting' && settings && playerColor && inviteLink) {
    return (
      <WaitingLobby
        gameId={gameId}
        settings={settings}
        inviteLink={inviteLink}
        playerColor={playerColor}
      />
    );
  }

  // Joining state (for player who clicks invite link)
  if (status === 'joining') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Joining game...</p>
        </div>
      </div>
    );
  }

  // Active game state
  if (status === 'active') {
    if (!boardState && playerColor) {
      return <GameStarting playerColor={playerColor} />;
    }
    return (
      <>
        <ConnectionStatus isConnected={isConnected} />
        <ActiveGame socket={socket} gameId={gameId} />
      </>
    );
  }

  // Game ended state
  if (status === 'ended') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Game Over</h2>
        <p className="text-gray-600">Results will be shown here</p>
      </div>
    );
  }

  // Default/idle state
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Loading game...</p>
      </div>
    </div>
  );
}
