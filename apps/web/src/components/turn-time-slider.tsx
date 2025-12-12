'use client';

interface TurnTimeSliderProps {
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

// Find the closest preset option index for a given value
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

export function TurnTimeSlider({ value, onChange }: TurnTimeSliderProps) {
  const sliderIndex = getSliderIndex(value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value, 10);
    onChange(TIME_OPTIONS[index].value);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Time per Turn</label>
        <span className="text-sm text-gray-600">{formatTime(value)}</span>
      </div>
      <input
        type="range"
        min="0"
        max={TIME_OPTIONS.length - 1}
        step="1"
        value={sliderIndex}
        onChange={handleSliderChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500">
        {TIME_OPTIONS.filter((opt) => opt.showLabel).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-1 py-1 rounded ${value === opt.value ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
