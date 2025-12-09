'use client';

interface GracePeriodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function GracePeriodSlider({ value, onChange }: GracePeriodSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Grace Period</label>
        <span className="text-sm text-gray-600">
          {value === 0 ? 'None' : `${value}s`}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="5"
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500">
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`w-8 h-6 rounded ${value === v ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            {v}s
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Extra time after turn timer expires before action is taken.
      </p>
    </div>
  );
}
