'use client';

import { useRouter } from 'next/navigation';
import type { GameResult } from '@anti-flag-chess/core';

interface GameOverModalProps {
  result: GameResult;
  playerColor: 'white' | 'black';
  whiteTimeUsed: number;
  blackTimeUsed: number;
}

function formatTotalTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
}

function getResultMessage(result: GameResult, playerColor: 'white' | 'black'): { title: string; message: string } {
  if (result.winner === 'draw') {
    const reasonMessages: Record<string, string> = {
      stalemate: 'The game ended in stalemate.',
      agreed_draw: 'Both players agreed to a draw.',
      threefold_repetition: 'Draw by threefold repetition.',
      fifty_move_rule: 'Draw by fifty-move rule.',
      insufficient_material: 'Draw by insufficient material.',
    };
    return {
      title: 'Draw!',
      message: reasonMessages[result.reason] || 'The game ended in a draw.',
    };
  }

  const won = result.winner === playerColor;
  const reasonMessages: Record<string, string> = {
    checkmate: won ? 'You checkmated your opponent!' : 'You were checkmated.',
    resignation: won ? 'Your opponent resigned.' : 'You resigned.',
    time_loss: won ? 'Your opponent ran out of time.' : 'You ran out of time.',
  };

  return {
    title: won ? 'You Won!' : 'You Lost',
    message: reasonMessages[result.reason] || (won ? 'Congratulations!' : 'Better luck next time!'),
  };
}

export function GameOverModal({ result, playerColor, whiteTimeUsed, blackTimeUsed }: GameOverModalProps) {
  const router = useRouter();
  const { title, message } = getResultMessage(result, playerColor);

  const isWin = result.winner === playerColor;
  const isDraw = result.winner === 'draw';
  const totalGameTime = whiteTimeUsed + blackTimeUsed;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 text-center">
        <div className="mb-4">
          <div
            className={`
              w-16 h-16 mx-auto rounded-full flex items-center justify-center
              ${isWin ? 'bg-green-100' : isDraw ? 'bg-yellow-100' : 'bg-red-100'}
            `}
          >
            {isWin ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : isDraw ? (
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>

        {/* Time Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Game Time</h3>

          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-gray-800">{formatTotalTime(totalGameTime)}</div>
            <div className="text-xs text-gray-500 uppercase">Total Active Play</div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-4 h-4 rounded border border-gray-300 bg-white" />
                <span className="text-sm font-medium text-gray-600">White</span>
              </div>
              <div className="text-lg font-semibold text-gray-800">{formatTotalTime(whiteTimeUsed)}</div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-4 h-4 rounded border border-gray-300 bg-gray-800" />
                <span className="text-sm font-medium text-gray-600">Black</span>
              </div>
              <div className="text-lg font-semibold text-gray-800">{formatTotalTime(blackTimeUsed)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => router.push('/create')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
