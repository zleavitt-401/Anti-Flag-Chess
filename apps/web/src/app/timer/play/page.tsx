'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIRLTimer } from '../../../hooks/useIRLTimer';
import { IrlTimerDisplay } from '../../../components/irl-timer-display';
import { IrlTimerControls } from '../../../components/irl-timer-controls';
import { IrlPausedOverlay } from '../../../components/irl-paused-overlay';
import { IrlSummaryModal } from '../../../components/irl-summary-modal';
import { IrlGraceOverlay } from '../../../components/irl-grace-overlay';

export default function TimerPlayPage() {
  const router = useRouter();
  const {
    session,
    isWarningTime,
    isPulseTime,
    graceProgress,
    switchTurn,
    pause,
    resume,
    endGame,
    playAgain,
    backToSetup,
  } = useIRLTimer();

  // Redirect to setup if not in a valid game state
  useEffect(() => {
    if (session.phase === 'setup') {
      router.replace('/timer');
    }
  }, [session.phase, router]);

  // Navigation guard - warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (session.phase === 'playing') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [session.phase]);

  const handleEndGame = () => {
    if (window.confirm('End the game? You will see a summary of time used.')) {
      endGame();
    }
  };

  const handleBackToSetup = () => {
    backToSetup();
    router.push('/timer');
  };

  const handlePlayAgain = () => {
    playAgain();
  };

  // Don't render until we're in a valid state
  if (session.phase === 'setup') {
    return null;
  }

  const isPaused = session.phase === 'paused';
  const isEnded = session.phase === 'ended';

  // Determine warning states for active timer only
  const whiteIsActive = session.activePlayer === 'white';
  const blackIsActive = session.activePlayer === 'black';

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        background: 'linear-gradient(180deg, hsl(240, 30%, 10%), hsl(260, 35%, 15%))',
      }}
    >
      {/* Timer displays - stacked vertically */}
      <div className="flex-1 flex flex-col gap-4 p-4 max-w-lg mx-auto w-full">
        {/* Black timer (top) - rotated 180° for opponent */}
        <div className="flex-1 flex">
          <IrlTimerDisplay
            timer={session.black}
            isActive={blackIsActive}
            isWarning={blackIsActive && isWarningTime}
            isPulsing={blackIsActive && isPulseTime}
            isExpired={session.black.expired}
            onTap={switchTurn}
            disabled={isPaused || isEnded}
            isRotated={true}
          />
        </div>

        {/* Controls in the middle */}
        <IrlTimerControls
          isPaused={isPaused}
          isEnded={isEnded}
          onPause={pause}
          onResume={resume}
          onEndGame={handleEndGame}
        />

        {/* White timer (bottom) */}
        <div className="flex-1 flex">
          <IrlTimerDisplay
            timer={session.white}
            isActive={whiteIsActive}
            isWarning={whiteIsActive && isWarningTime}
            isPulsing={whiteIsActive && isPulseTime}
            isExpired={session.white.expired}
            onTap={switchTurn}
            disabled={isPaused || isEnded}
          />
        </div>
      </div>

      {/* Grace period overlay */}
      {session.isInGracePeriod && (
        <IrlGraceOverlay
          graceElapsedMs={session.graceElapsedMs}
          graceProgress={graceProgress}
          onTap={switchTurn}
          isRotated={session.graceTriggerPlayer === 'black'}
        />
      )}

      {/* Paused overlay */}
      {isPaused && (
        <IrlPausedOverlay onResume={resume} timeoutContext={session.timeoutContext} />
      )}

      {/* Summary modal */}
      {isEnded && (
        <IrlSummaryModal
          white={session.white}
          black={session.black}
          onPlayAgain={handlePlayAgain}
          onBackToSetup={handleBackToSetup}
        />
      )}
    </div>
  );
}
