'use client';

import { PlayerTimer } from '../lib/types/irl-timer';

// Brutalist beveled corners
const BEVEL_CLIP = 'polygon(0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px))';
const SMALL_BEVEL_CLIP = 'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))';
const BTN_BEVEL_CLIP = 'polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))';
const TINY_BEVEL_CLIP = 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))';

interface IrlSummaryModalProps {
  white: PlayerTimer;
  black: PlayerTimer;
  onPlayAgain: () => void;
  onBackToSetup: () => void;
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

export function IrlSummaryModal({
  white,
  black,
  onPlayAgain,
  onBackToSetup,
}: IrlSummaryModalProps) {
  // Calculate total active play time
  const totalActivePlayTime = white.totalUsedMs + black.totalUsedMs;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: 'hsla(240, 30%, 8%, 0.9)',
        backdropFilter: 'blur(4px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-title"
    >
      <div
        className="p-6 max-w-sm mx-4 w-full"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          clipPath: BEVEL_CLIP,
          background: 'linear-gradient(135deg, hsl(240, 30%, 15%), hsl(260, 35%, 22%))',
          border: '2px solid hsl(260, 35%, 40%)',
          boxShadow: '8px 8px 0 hsla(260, 100%, 80%, 0.2)',
        }}
      >
        <h2
          id="summary-title"
          className="text-2xl font-bold uppercase tracking-widest mb-6 text-center"
          style={{ color: 'hsl(142, 76%, 70%)' }}
        >
          Game Summary
        </h2>

        {/* Total Active Play Time */}
        <div
          className="p-4 mb-4 text-center"
          style={{
            clipPath: SMALL_BEVEL_CLIP,
            background: 'linear-gradient(135deg, hsl(190, 40%, 18%), hsl(190, 40%, 25%))',
            border: '2px solid hsl(190, 100%, 60%)',
            boxShadow: '4px 4px 0 hsla(190, 100%, 70%, 0.2)',
          }}
        >
          <div
            className="text-xs uppercase tracking-widest mb-1"
            style={{ color: 'hsl(190, 100%, 80%)', opacity: 0.8 }}
          >
            Total Active Play Time
          </div>
          <div
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'hsl(190, 100%, 75%)' }}
          >
            {formatTotalTime(totalActivePlayTime)}
          </div>
        </div>

        {/* Individual Player Times */}
        <div className="space-y-3 mb-6">
          {/* White */}
          <div
            className="flex items-center justify-between p-4"
            style={{
              clipPath: SMALL_BEVEL_CLIP,
              background: 'linear-gradient(135deg, hsl(240, 25%, 18%), hsl(240, 25%, 22%))',
              border: '1px solid hsl(260, 30%, 35%)',
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-5 h-5 border-2"
                style={{
                  clipPath: TINY_BEVEL_CLIP,
                  backgroundColor: '#f0f0f0',
                  borderColor: '#888',
                }}
              />
              <span
                className="font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(260, 100%, 80%)' }}
              >
                White
              </span>
            </div>
            <span
              className="text-xl font-bold"
              style={{ color: 'hsl(260, 100%, 85%)' }}
            >
              {formatTotalTime(white.totalUsedMs)}
            </span>
          </div>

          {/* Black */}
          <div
            className="flex items-center justify-between p-4"
            style={{
              clipPath: SMALL_BEVEL_CLIP,
              background: 'linear-gradient(135deg, hsl(240, 25%, 18%), hsl(240, 25%, 22%))',
              border: '1px solid hsl(260, 30%, 35%)',
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-5 h-5 border-2"
                style={{
                  clipPath: TINY_BEVEL_CLIP,
                  backgroundColor: '#1a1a1a',
                  borderColor: '#555',
                }}
              />
              <span
                className="font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(260, 100%, 80%)' }}
              >
                Black
              </span>
            </div>
            <span
              className="text-xl font-bold"
              style={{ color: 'hsl(260, 100%, 85%)' }}
            >
              {formatTotalTime(black.totalUsedMs)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full px-6 py-4 font-bold uppercase tracking-widest text-base min-h-[52px] transition-all duration-100 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]"
            style={{
              clipPath: BTN_BEVEL_CLIP,
              background: 'linear-gradient(135deg, hsl(142, 50%, 28%), hsl(142, 45%, 38%))',
              border: '2px solid hsl(142, 50%, 50%)',
              color: '#fff',
              boxShadow: '6px 6px 0 hsla(142, 76%, 70%, 0.3)',
            }}
            aria-label="Play again with same settings"
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={onBackToSetup}
            className="w-full px-6 py-3 font-bold uppercase tracking-widest text-sm min-h-[48px] transition-all duration-100 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]"
            style={{
              clipPath: BTN_BEVEL_CLIP,
              background: 'linear-gradient(135deg, hsl(240, 25%, 20%), hsl(240, 25%, 28%))',
              border: '2px solid hsl(260, 30%, 45%)',
              color: 'hsl(260, 100%, 80%)',
              boxShadow: '4px 4px 0 hsla(260, 100%, 80%, 0.15)',
            }}
            aria-label="Return to timer setup"
          >
            Back to Setup
          </button>
        </div>
      </div>
    </div>
  );
}
