'use client';

interface TurnTimeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const TIME_OPTIONS = [
  { value: 10, label: '10s' },
  { value: 30, label: '30s' },
  { value: 60, label: '1min' },
  { value: 120, label: '2min' },
  { value: 180, label: '3min' },
  { value: 300, label: '5min' },
];

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function TurnTimeSlider({ value, onChange }: TurnTimeSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Time per Turn</label>
        <span className="text-sm text-gray-600">{formatTime(value)}</span>
      </div>
      <input
        type="range"
        min="10"
        max="300"
        step="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500">
        {TIME_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2 py-1 rounded ${value === opt.value ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
