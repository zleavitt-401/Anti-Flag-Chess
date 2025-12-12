'use client';

import { PlayerTimer } from '../lib/types/irl-timer';

interface IrlTimerDisplayProps {
  timer: PlayerTimer;
  isActive: boolean;
  isWarning?: boolean;
  isPulsing?: boolean;
  isExpired?: boolean;
  onTap: () => void;
  disabled?: boolean;
  isRotated?: boolean;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Brutalist beveled corners clip-path
const BEVEL_CLIP = 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))';
const SMALL_BEVEL_CLIP = 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))';
const TINY_BEVEL_CLIP = 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px))';

export function IrlTimerDisplay({
  timer,
  isActive,
  isWarning = false,
  isPulsing = false,
  isExpired = false,
  onTap,
  disabled = false,
  isRotated = false,
}: IrlTimerDisplayProps) {
  const handleClick = () => {
    if (!disabled && isActive) {
      onTap();
    }
  };

  // Brutalist color scheme based on state
  let bgGradient = 'linear-gradient(135deg, hsl(240, 30%, 15%), hsl(260, 35%, 22%))';
  let textColor = 'hsl(260, 100%, 80%)'; // twilight-accent
  let borderColor = 'hsl(260, 35%, 35%)';
  let shadowColor = 'hsla(260, 100%, 80%, 0.2)';

  if (isActive) {
    if (isExpired) {
      bgGradient = 'linear-gradient(135deg, hsl(0, 60%, 18%), hsl(0, 60%, 25%))';
      textColor = 'hsl(45, 85%, 70%)'; // earth-light
      borderColor = 'hsl(0, 60%, 40%)';
      shadowColor = 'hsla(0, 60%, 50%, 0.4)';
    } else if (isPulsing) {
      bgGradient = 'linear-gradient(135deg, hsl(0, 60%, 15%), hsl(25, 70%, 30%))';
      textColor = 'hsl(45, 85%, 70%)'; // earth-light
      borderColor = 'hsl(25, 70%, 50%)';
      shadowColor = 'hsla(25, 70%, 50%, 0.4)';
    } else if (isWarning) {
      bgGradient = 'linear-gradient(135deg, hsl(25, 50%, 18%), hsl(45, 60%, 25%))';
      textColor = 'hsl(45, 85%, 75%)'; // warm yellow
      borderColor = 'hsl(45, 70%, 45%)';
      shadowColor = 'hsla(45, 70%, 50%, 0.3)';
    } else {
      bgGradient = 'linear-gradient(135deg, hsl(142, 50%, 20%), hsl(142, 45%, 28%))';
      textColor = 'hsl(142, 76%, 70%)'; // forest-accent
      borderColor = 'hsl(142, 50%, 45%)';
      shadowColor = 'hsla(142, 76%, 70%, 0.3)';
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || !isActive}
      aria-label={`${timer.color} player timer. ${formatTime(timer.remainingMs)} remaining. ${isActive ? 'Tap to end turn.' : 'Waiting for opponent.'}`}
      className={`
        w-full flex-1 min-h-[140px] transition-all duration-100
        flex flex-col items-center justify-center gap-2 p-4
        ${isActive && !disabled ? 'cursor-pointer active:translate-x-[2px] active:translate-y-[2px]' : 'cursor-default'}
        ${isPulsing && isActive ? 'animate-pulse' : ''}
      `}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        clipPath: BEVEL_CLIP,
        background: bgGradient,
        border: `2px solid ${borderColor}`,
        boxShadow: isActive ? `6px 6px 0 ${shadowColor}` : `4px 4px 0 hsla(260, 100%, 80%, 0.1)`,
        transform: isRotated ? 'rotate(180deg)' : undefined,
        animationDuration: isPulsing ? '0.5s' : undefined,
      }}
    >
      {/* Player indicator */}
      <div className="flex items-center gap-3">
        <span
          className="w-6 h-6 border-2"
          style={{
            clipPath: SMALL_BEVEL_CLIP,
            backgroundColor: timer.color === 'white' ? '#f0f0f0' : '#1a1a1a',
            borderColor: timer.color === 'white' ? '#888' : '#555',
          }}
        />
        <span
          className="text-lg font-semibold uppercase tracking-wider"
          style={{ color: textColor }}
        >
          {timer.color}
        </span>
        {isActive && (
          <span
            className="text-xs font-bold uppercase tracking-widest px-2 py-1"
            style={{
              backgroundColor: borderColor,
              color: '#fff',
              clipPath: TINY_BEVEL_CLIP,
            }}
          >
            Active
          </span>
        )}
      </div>

      {/* Time display */}
      <div
        className="text-6xl font-bold tracking-tight"
        style={{ color: textColor }}
      >
        {formatTime(timer.remainingMs)}
      </div>

      {/* Expired indicator */}
      {isExpired && isActive && (
        <div
          className="text-sm font-bold uppercase tracking-wider"
          style={{ color: 'hsl(45, 85%, 70%)' }}
        >
          Time Expired
        </div>
      )}

      {/* Tap hint for active player */}
      {isActive && !disabled && !isExpired && (
        <div
          className="text-xs uppercase tracking-widest opacity-70"
          style={{ color: textColor }}
        >
          Tap to End Turn
        </div>
      )}
    </button>
  );
}
