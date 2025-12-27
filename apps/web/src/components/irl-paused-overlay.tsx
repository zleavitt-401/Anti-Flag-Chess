'use client';

import { TimeoutContext } from '../lib/types/irl-timer';

// Brutalist beveled corners
const BEVEL_CLIP = 'polygon(0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px))';
const BTN_BEVEL_CLIP = 'polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))';

interface IrlPausedOverlayProps {
  onResume: () => void;
  /** Context when paused due to timeout (grace period expired with "Pause" behavior) */
  timeoutContext?: TimeoutContext | null;
}

export function IrlPausedOverlay({ onResume, timeoutContext }: IrlPausedOverlayProps) {
  const isTimeoutPause = !!timeoutContext;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: 'hsla(240, 30%, 8%, 0.9)',
        backdropFilter: 'blur(4px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paused-title"
    >
      <div
        className="p-8 max-w-sm mx-4 text-center"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          clipPath: BEVEL_CLIP,
          background: 'linear-gradient(135deg, hsl(240, 30%, 15%), hsl(260, 35%, 22%))',
          border: '2px solid hsl(260, 35%, 40%)',
          boxShadow: '8px 8px 0 hsla(260, 100%, 80%, 0.2)',
        }}
      >
        <h2
          id="paused-title"
          className="text-4xl font-bold uppercase tracking-widest mb-4"
          style={{ color: isTimeoutPause ? 'hsl(0, 70%, 65%)' : 'hsl(190, 100%, 70%)' }}
        >
          {isTimeoutPause ? 'Time Expired' : 'Paused'}
        </h2>
        {isTimeoutPause && timeoutContext && (
          <p
            className="mb-4 uppercase tracking-wider text-lg font-semibold"
            style={{ color: 'hsl(45, 85%, 70%)' }}
          >
            {timeoutContext.expiredPlayer === 'white' ? "White's" : "Black's"} time ran out
          </p>
        )}
        <p
          className="mb-6 uppercase tracking-wider text-sm"
          style={{ color: 'hsl(260, 100%, 80%)', opacity: 0.8 }}
        >
          {isTimeoutPause
            ? 'Tap Resume to switch to the other player.'
            : 'Both timers are frozen. Tap Resume to continue.'}
        </p>
        <button
          type="button"
          onClick={onResume}
          className="w-full px-6 py-4 font-bold uppercase tracking-widest text-lg min-h-[56px] transition-all duration-100 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]"
          style={{
            clipPath: BTN_BEVEL_CLIP,
            background: 'linear-gradient(135deg, hsl(142, 50%, 28%), hsl(142, 45%, 38%))',
            border: '2px solid hsl(142, 50%, 50%)',
            color: '#fff',
            boxShadow: '6px 6px 0 hsla(142, 76%, 70%, 0.3)',
          }}
          aria-label="Resume game"
        >
          Resume
        </button>
      </div>
    </div>
  );
}
