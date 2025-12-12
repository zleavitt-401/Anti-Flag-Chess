'use client';

// Brutalist beveled corners
const BEVEL_CLIP = 'polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))';

interface IrlTimerControlsProps {
  isPaused: boolean;
  isEnded: boolean;
  onPause: () => void;
  onResume: () => void;
  onEndGame: () => void;
}

export function IrlTimerControls({
  isPaused,
  isEnded,
  onPause,
  onResume,
  onEndGame,
}: IrlTimerControlsProps) {
  if (isEnded) {
    return null;
  }

  return (
    <div className="flex gap-4 justify-center py-2">
      {/* Pause/Resume button */}
      <button
        type="button"
        onClick={isPaused ? onResume : onPause}
        className="px-6 py-3 font-bold uppercase tracking-wider text-sm min-h-[48px] min-w-[110px] transition-all duration-100 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          clipPath: BEVEL_CLIP,
          background: isPaused
            ? 'linear-gradient(135deg, hsl(142, 50%, 28%), hsl(142, 45%, 38%))'
            : 'linear-gradient(135deg, hsl(190, 40%, 22%), hsl(190, 40%, 30%))',
          border: isPaused ? '2px solid hsl(142, 50%, 50%)' : '2px solid hsl(190, 100%, 70%)',
          color: isPaused ? 'hsl(142, 76%, 80%)' : 'hsl(190, 100%, 80%)',
          boxShadow: isPaused
            ? '4px 4px 0 hsla(142, 76%, 70%, 0.3)'
            : '4px 4px 0 hsla(190, 100%, 70%, 0.3)',
        }}
        aria-label={isPaused ? 'Resume game' : 'Pause game'}
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>

      {/* End Game button */}
      <button
        type="button"
        onClick={onEndGame}
        className="px-6 py-3 font-bold uppercase tracking-wider text-sm min-h-[48px] min-w-[110px] transition-all duration-100 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          clipPath: BEVEL_CLIP,
          background: 'linear-gradient(135deg, hsl(0, 60%, 20%), hsl(0, 60%, 28%))',
          border: '2px solid hsl(0, 60%, 45%)',
          color: 'hsl(45, 85%, 75%)',
          boxShadow: '4px 4px 0 hsla(0, 60%, 50%, 0.3)',
        }}
        aria-label="End game"
      >
        End Game
      </button>
    </div>
  );
}
