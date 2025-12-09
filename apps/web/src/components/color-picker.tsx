'use client';

interface ColorPickerProps {
  value: 'white' | 'black';
  onChange: (value: 'white' | 'black') => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Your Color</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange('white')}
          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
            value === 'white'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-white border-2 border-gray-300" />
          <span className="font-medium">White</span>
        </button>
        <button
          type="button"
          onClick={() => onChange('black')}
          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
            value === 'black'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-600" />
          <span className="font-medium">Black</span>
        </button>
      </div>
    </div>
  );
}
