'use client';

import type { TimeoutBehavior } from '@anti-flag-chess/core';

interface TimeoutBehaviorToggleProps {
  value: TimeoutBehavior;
  onChange: (value: TimeoutBehavior) => void;
}

export function TimeoutBehaviorToggle({ value, onChange }: TimeoutBehaviorToggleProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">On Timeout</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange('auto_move')}
          className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
            value === 'auto_move'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="font-medium">Auto-Move</div>
          <div className="text-xs text-gray-500">Random move played</div>
        </button>
        <button
          type="button"
          onClick={() => onChange('lose_on_time')}
          className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
            value === 'lose_on_time'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="font-medium">Lose on Time</div>
          <div className="text-xs text-gray-500">Standard flagging</div>
        </button>
      </div>
      <p className="text-xs text-gray-500">
        {value === 'auto_move'
          ? 'A random pawn move (or any move) will be played automatically when time runs out.'
          : 'Running out of time results in losing the game.'}
      </p>
    </div>
  );
}
