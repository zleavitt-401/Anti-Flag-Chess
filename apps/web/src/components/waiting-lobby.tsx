'use client';

import type { GameSettings } from '@anti-flag-chess/core';
import { InviteLinkDisplay } from './invite-link-display';

interface WaitingLobbyProps {
  gameId: string;
  settings: GameSettings;
  inviteLink: string;
  playerColor: 'white' | 'black';
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function WaitingLobby({ gameId, settings, inviteLink, playerColor }: WaitingLobbyProps) {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Waiting for Opponent</h2>
        <p className="text-gray-600">Share the link below to invite someone to play</p>
      </div>

      <InviteLinkDisplay link={inviteLink} />

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold">Game Settings</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-600">Time per turn:</div>
          <div className="font-medium">{formatTime(settings.turnTimeSeconds)}</div>

          <div className="text-gray-600">Grace period:</div>
          <div className="font-medium">
            {settings.gracePeriodSeconds === 0 ? 'None' : `${settings.gracePeriodSeconds}s`}
          </div>

          <div className="text-gray-600">On timeout:</div>
          <div className="font-medium">
            {settings.timeoutBehavior === 'auto_move' ? 'Auto-move' : 'Lose on time'}
          </div>

          <div className="text-gray-600">Your color:</div>
          <div className="font-medium capitalize">{playerColor}</div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        Game ID: <code className="bg-gray-100 px-2 py-1 rounded">{gameId}</code>
      </div>

      <div className="flex justify-center">
        <div className="animate-pulse flex items-center gap-2 text-blue-600">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
          <span>Waiting for opponent to join...</span>
        </div>
      </div>
    </div>
  );
}
