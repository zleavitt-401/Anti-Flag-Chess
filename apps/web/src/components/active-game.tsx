'use client';

import { useEffect, useCallback, useState } from 'react';
import type { Socket } from 'socket.io-client';
import type { BoardState, TimerState, Move, GameResult } from '@anti-flag-chess/core';
import { useGameStore } from '@/lib/store/game-store';
import { useMakeMove } from '@/hooks/useMakeMove';
import { useTimerSync } from '@/hooks/useTimerSync';
import { useResign } from '@/hooks/useResign';
import { useDrawOffer } from '@/hooks/useDrawOffer';
import { ChessBoard } from './chess-board';
import { TurnTimer } from './turn-timer';
import { TurnIndicator } from './turn-indicator';
import { GameOverModal } from './game-over-modal';
import { AutoMoveNotification } from './auto-move-notification';
import { GameActions } from './game-actions';
import { ResignConfirmModal } from './resign-confirm-modal';
import { DrawOfferModal } from './draw-offer-modal';
import { DrawReceivedModal } from './draw-received-modal';
import { OpponentDisconnected } from './opponent-disconnected';
import { GracePeriodOverlay } from './grace-period-overlay';

interface ActiveGameProps {
  socket: Socket | null;
  gameId: string;
}

interface MoveEvent {
  move: Move;
  boardState: BoardState;
  timers: TimerState;
}

interface GameOverEvent {
  result: GameResult;
  finalBoardState: BoardState;
}

interface GraceStartedEvent {
  player: 'white' | 'black';
  graceTimeRemaining: number;
}

interface AutoMoveEvent {
  move: Move;
  boardState: BoardState;
  timers: TimerState;
  reason: string;
}

export function ActiveGame({ socket, gameId }: ActiveGameProps) {
  const {
    boardState,
    timerState,
    playerColor,
    result,
    lastMove,
    isLastMoveAuto,
    autoMoveNotification,
    setBoardState,
    setTimerState,
    addMove,
    setResult,
    setStatus,
    setAutoMoveNotification,
  } = useGameStore();

  const { makeMove } = useMakeMove(socket, gameId);
  useTimerSync(socket);
  const { resign } = useResign(socket, gameId);
  const { offerDraw, respondToDraw, pendingDrawOffer } = useDrawOffer(socket, gameId);

  // Modal states
  const [showResignModal, setShowResignModal] = useState(false);
  const [showDrawOfferModal, setShowDrawOfferModal] = useState(false);
  const [hasOfferedDraw, setHasOfferedDraw] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  // Listen for move events
  useEffect(() => {
    if (!socket) return;

    const handleMove = (event: MoveEvent) => {
      setBoardState(event.boardState);
      setTimerState(event.timers);
      addMove(event.move);
    };

    const handleAutoMove = (event: AutoMoveEvent) => {
      setBoardState(event.boardState);
      setTimerState(event.timers);
      addMove(event.move, true); // Mark as auto-move
      // Show notification about which player had auto-move
      const autoMovePlayer = event.boardState.turn; // Turn switched, so the previous player was auto-moved
      setAutoMoveNotification({ player: autoMovePlayer === 'white' ? 'black' : 'white' });
    };

    const handleGraceStarted = (event: GraceStartedEvent) => {
      setTimerState((prev) =>
        prev
          ? {
              ...prev,
              isGracePeriod: true,
              graceTimeRemaining: event.graceTimeRemaining,
            }
          : null
      );
    };

    const handleGameOver = (event: GameOverEvent) => {
      setBoardState(event.finalBoardState);
      setResult(event.result);
      setStatus('ended');
    };

    const handleOpponentDisconnected = () => {
      setOpponentDisconnected(true);
    };

    const handleOpponentReconnected = () => {
      setOpponentDisconnected(false);
    };

    socket.on('move_made', handleMove);
    socket.on('auto_move', handleAutoMove);
    socket.on('grace_started', handleGraceStarted);
    socket.on('game_over', handleGameOver);
    socket.on('opponent_disconnected', handleOpponentDisconnected);
    socket.on('opponent_reconnected', handleOpponentReconnected);

    return () => {
      socket.off('move_made', handleMove);
      socket.off('auto_move', handleAutoMove);
      socket.off('grace_started', handleGraceStarted);
      socket.off('game_over', handleGameOver);
      socket.off('opponent_disconnected', handleOpponentDisconnected);
      socket.off('opponent_reconnected', handleOpponentReconnected);
    };
  }, [socket, setBoardState, setTimerState, addMove, setResult, setStatus, setAutoMoveNotification]);

  const handleMove = useCallback(
    (move: string) => {
      makeMove(move);
    },
    [makeMove]
  );

  const handleResignClick = useCallback(() => {
    setShowResignModal(true);
  }, []);

  const handleResignConfirm = useCallback(() => {
    resign();
    setShowResignModal(false);
  }, [resign]);

  const handleDrawOfferClick = useCallback(() => {
    setShowDrawOfferModal(true);
  }, []);

  const handleDrawOfferConfirm = useCallback(() => {
    offerDraw();
    setHasOfferedDraw(true);
    setShowDrawOfferModal(false);
  }, [offerDraw]);

  const handleDrawAccept = useCallback(() => {
    respondToDraw(true);
  }, [respondToDraw]);

  const handleDrawDecline = useCallback(() => {
    respondToDraw(false);
  }, [respondToDraw]);

  // Check if we received a draw offer (not one we sent)
  const receivedDrawOffer =
    pendingDrawOffer && pendingDrawOffer.from !== playerColor ? pendingDrawOffer : null;

  if (!boardState || !playerColor) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  const opponentColor = playerColor === 'white' ? 'black' : 'white';
  const isPlayerGrace = timerState?.isGracePeriod && timerState.activePlayer === playerColor;
  const isOpponentGrace = timerState?.isGracePeriod && timerState.activePlayer === opponentColor;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Opponent timer */}
      <div className="mb-4">
        <TurnTimer
          timeRemaining={
            timerState
              ? opponentColor === 'white'
                ? timerState.whiteTimeRemaining
                : timerState.blackTimeRemaining
              : 0
          }
          isActive={timerState?.activePlayer === opponentColor}
          isGracePeriod={isOpponentGrace}
          color={opponentColor}
        />
      </div>

      {/* Chess board */}
      <div className="mb-4">
        <ChessBoard
          boardState={boardState}
          playerColor={playerColor}
          onMove={handleMove}
          disabled={boardState.turn !== playerColor || result !== null}
          lastMove={lastMove}
          isAutoMove={isLastMoveAuto}
        />
      </div>

      {/* Player timer */}
      <div className="mb-4">
        <TurnTimer
          timeRemaining={
            timerState
              ? playerColor === 'white'
                ? timerState.whiteTimeRemaining
                : timerState.blackTimeRemaining
              : 0
          }
          isActive={timerState?.activePlayer === playerColor}
          isGracePeriod={isPlayerGrace}
          color={playerColor}
        />
      </div>

      {/* Turn indicator */}
      <TurnIndicator currentTurn={boardState.turn} playerColor={playerColor} />

      {/* Game actions */}
      {!result && (
        <GameActions
          onResign={handleResignClick}
          onOfferDraw={handleDrawOfferClick}
          isDisabled={result !== null}
          hasPendingDrawOffer={hasOfferedDraw}
        />
      )}

      {/* Game over modal */}
      {result && <GameOverModal result={result} playerColor={playerColor} />}

      {/* Resign confirmation modal */}
      {showResignModal && (
        <ResignConfirmModal
          onConfirm={handleResignConfirm}
          onCancel={() => setShowResignModal(false)}
        />
      )}

      {/* Draw offer modal */}
      {showDrawOfferModal && (
        <DrawOfferModal
          onConfirm={handleDrawOfferConfirm}
          onCancel={() => setShowDrawOfferModal(false)}
        />
      )}

      {/* Draw received modal */}
      {receivedDrawOffer && (
        <DrawReceivedModal
          from={receivedDrawOffer.from}
          onAccept={handleDrawAccept}
          onDecline={handleDrawDecline}
        />
      )}

      {/* Auto-move notification */}
      <AutoMoveNotification
        isVisible={autoMoveNotification !== null}
        player={autoMoveNotification?.player || 'white'}
        onDismiss={() => setAutoMoveNotification(null)}
      />

      {/* Opponent disconnected notification */}
      <OpponentDisconnected isVisible={opponentDisconnected} />

      {/* Grace period overlay - shows urgent warning when player must move */}
      <GracePeriodOverlay
        isActive={timerState?.isGracePeriod || false}
        isMyTurn={timerState?.activePlayer === playerColor}
        graceTimeRemaining={timerState?.graceTimeRemaining || 0}
      />
    </div>
  );
}
