'use client';

import { useState } from 'react';
import type { GameSettings, TimeoutBehavior } from '@anti-flag-chess/core';
import { DEFAULT_GAME_SETTINGS } from '@anti-flag-chess/core';
import { TurnTimeSlider } from './turn-time-slider';
import { GracePeriodSlider } from './grace-period-slider';
import { TimeoutBehaviorToggle } from './timeout-behavior-toggle';
import { ColorPicker } from './color-picker';

interface GameConfigFormProps {
  onSubmit: (settings: GameSettings) => void;
  isLoading?: boolean;
}

export function GameConfigForm({ onSubmit, isLoading }: GameConfigFormProps) {
  const [turnTimeSeconds, setTurnTimeSeconds] = useState(DEFAULT_GAME_SETTINGS.turnTimeSeconds);
  const [gracePeriodSeconds, setGracePeriodSeconds] = useState(DEFAULT_GAME_SETTINGS.gracePeriodSeconds);
  const [timeoutBehavior, setTimeoutBehavior] = useState<TimeoutBehavior>(DEFAULT_GAME_SETTINGS.timeoutBehavior);
  const [hostColor, setHostColor] = useState<'white' | 'black'>(DEFAULT_GAME_SETTINGS.hostColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      turnTimeSeconds,
      gracePeriodSeconds,
      timeoutBehavior,
      hostColor,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Game Settings</h3>

        <TurnTimeSlider
          value={turnTimeSeconds}
          onChange={setTurnTimeSeconds}
        />

        <GracePeriodSlider
          value={gracePeriodSeconds}
          onChange={setGracePeriodSeconds}
        />

        <TimeoutBehaviorToggle
          value={timeoutBehavior}
          onChange={setTimeoutBehavior}
        />

        <ColorPicker
          value={hostColor}
          onChange={setHostColor}
        />
      </div>

      <div className="pt-4 border-t">
        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
          <p className="font-medium">Game Summary:</p>
          <p className="text-gray-600">
            {turnTimeSeconds}s per turn, {gracePeriodSeconds}s grace period,{' '}
            {timeoutBehavior === 'auto_move' ? 'auto-move' : 'lose on time'} on timeout.
            You play as {hostColor}.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating...' : 'Create Game'}
        </button>
      </div>
    </form>
  );
}
