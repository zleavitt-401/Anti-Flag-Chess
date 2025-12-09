'use client';

interface TurnTimerProps {
  timeRemaining: number; // milliseconds
  isActive: boolean;
  isGracePeriod?: boolean;
  color: 'white' | 'black';
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function TurnTimer({ timeRemaining, isActive, isGracePeriod, color }: TurnTimerProps) {
  const isLowTime = timeRemaining < 10000; // Less than 10 seconds

  return (
    <div
      className={`
        px-4 py-2 rounded-lg font-mono text-xl font-bold transition-all
        ${isActive ? 'ring-2 ring-blue-500' : ''}
        ${isGracePeriod ? 'bg-red-100 text-red-700 animate-pulse' : ''}
        ${isLowTime && isActive && !isGracePeriod ? 'bg-yellow-100 text-yellow-700' : ''}
        ${!isActive && !isGracePeriod ? 'bg-gray-100 text-gray-600' : ''}
        ${isActive && !isGracePeriod && !isLowTime ? 'bg-white text-black border border-gray-300' : ''}
      `}
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-4 h-4 rounded-full ${color === 'white' ? 'bg-white border-2 border-gray-300' : 'bg-gray-800'}`}
        />
        <span className="capitalize">{color}</span>
        <span className="ml-auto">{formatTime(timeRemaining)}</span>
      </div>
      {isGracePeriod && (
        <div className="text-xs text-red-600 mt-1">Grace Period!</div>
      )}
    </div>
  );
}
