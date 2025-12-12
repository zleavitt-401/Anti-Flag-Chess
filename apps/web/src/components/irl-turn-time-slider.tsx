'use client';

// Brutalist beveled corners
const TINY_BEVEL_CLIP = 'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))';

interface IrlTurnTimeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const TIME_OPTIONS = [
  { value: 10, label: '10s', showLabel: true },
  { value: 20, label: '20s', showLabel: false },
  { value: 30, label: '30s', showLabel: true },
  { value: 45, label: '45s', showLabel: false },
  { value: 60, label: '1m', showLabel: true },
  { value: 90, label: '1.5m', showLabel: false },
  { value: 120, label: '2m', showLabel: true },
  { value: 150, label: '2.5m', showLabel: false },
  { value: 180, label: '3m', showLabel: true },
  { value: 240, label: '4m', showLabel: false },
  { value: 300, label: '5m', showLabel: true },
];

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

function getSliderIndex(value: number): number {
  let closestIndex = 0;
  let closestDiff = Math.abs(TIME_OPTIONS[0].value - value);
  for (let i = 1; i < TIME_OPTIONS.length; i++) {
    const diff = Math.abs(TIME_OPTIONS[i].value - value);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestIndex = i;
    }
  }
  return closestIndex;
}

export function IrlTurnTimeSlider({ value, onChange }: IrlTurnTimeSliderProps) {
  const sliderIndex = getSliderIndex(value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value, 10);
    onChange(TIME_OPTIONS[index].value);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'hsl(260, 100%, 80%)' }}
        >
          Time per Turn
        </label>
        <span
          className="text-lg font-bold"
          style={{ color: 'hsl(142, 76%, 70%)' }}
        >
          {formatTime(value)}
        </span>
      </div>

      {/* Custom styled range input */}
      <div className="relative py-2">
        <input
          type="range"
          min="0"
          max={TIME_OPTIONS.length - 1}
          step="1"
          value={sliderIndex}
          onChange={handleSliderChange}
          className="irl-range-input w-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, hsl(142, 50%, 40%) ${(sliderIndex / (TIME_OPTIONS.length - 1)) * 100}%, hsl(240, 25%, 30%) ${(sliderIndex / (TIME_OPTIONS.length - 1)) * 100}%)`,
          }}
        />
      </div>

      {/* Quick select buttons */}
      <div className="flex justify-between gap-1">
        {TIME_OPTIONS.filter((opt) => opt.showLabel).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-100"
            style={{
              clipPath: TINY_BEVEL_CLIP,
              background: value === opt.value
                ? 'linear-gradient(135deg, hsl(142, 50%, 30%), hsl(142, 45%, 38%))'
                : 'linear-gradient(135deg, hsl(240, 25%, 22%), hsl(240, 25%, 28%))',
              border: value === opt.value
                ? '1px solid hsl(142, 50%, 50%)'
                : '1px solid hsl(260, 25%, 35%)',
              color: value === opt.value
                ? 'hsl(142, 76%, 75%)'
                : 'hsl(260, 100%, 80%)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
