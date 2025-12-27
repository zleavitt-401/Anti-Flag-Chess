'use client';

import { GRACE_PULSE_START_MS, GRACE_PULSE_END_MS } from '../lib/types/irl-timer';

interface IrlGraceOverlayProps {
  /** Time elapsed in grace period (ms) */
  graceElapsedMs: number;
  /** Progress through grace period (0-1) */
  graceProgress: number;
  /** Callback when overlay is tapped to switch turns */
  onTap: () => void;
}

/**
 * Full-screen red pulsing overlay during grace period
 * Pulse animation accelerates as grace period progresses
 */
export function IrlGraceOverlay({
  graceElapsedMs,
  graceProgress,
  onTap,
}: IrlGraceOverlayProps) {
  // Calculate accelerating pulse duration (1000ms → 200ms)
  const pulseDuration =
    GRACE_PULSE_START_MS -
    (GRACE_PULSE_START_MS - GRACE_PULSE_END_MS) * graceProgress;

  // Calculate negative time display
  const negativeSeconds = Math.ceil(graceElapsedMs / 1000);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
      onClick={onTap}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        animation: `grace-pulse ${pulseDuration}ms ease-in-out infinite`,
      }}
    >
      {/* Inline keyframes for pulsing animation */}
      <style jsx>{`
        @keyframes grace-pulse {
          0%,
          100% {
            background: hsla(0, 80%, 25%, 0.95);
          }
          50% {
            background: hsla(0, 85%, 40%, 0.98);
          }
        }
      `}</style>

      {/* Negative time display */}
      <div
        className="text-8xl font-bold tracking-tight mb-4"
        style={{ color: 'hsl(0, 100%, 90%)' }}
      >
        -{negativeSeconds}s
      </div>

      {/* Instruction text */}
      <div
        className="text-xl font-semibold uppercase tracking-widest"
        style={{ color: 'hsl(0, 100%, 80%)', opacity: 0.9 }}
      >
        Tap to Switch
      </div>
    </div>
  );
}
