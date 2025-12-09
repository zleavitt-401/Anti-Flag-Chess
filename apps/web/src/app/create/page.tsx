'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { useCreateGame } from '@/hooks/useCreateGame';
import { useGameStore } from '@/lib/store/game-store';
import { GameConfigForm } from '@/components/game-config-form';
import type { GameSettings } from '@anti-flag-chess/core';

export default function CreateGamePage() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const { createGame, isLoading } = useCreateGame(socket);
  const { status, gameId, error } = useGameStore();

  // Redirect to game page once created
  useEffect(() => {
    if (status === 'waiting' && gameId) {
      router.push(`/game/${gameId}`);
    }
  }, [status, gameId, router]);

  const handleSubmit = async (settings: GameSettings) => {
    await createGame(settings);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create Game</h1>
        <p className="text-gray-600">Configure your Anti-Flag Chess game settings</p>
      </div>

      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          Connecting to server...
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <GameConfigForm onSubmit={handleSubmit} isLoading={isLoading || !isConnected} />
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => router.push('/')}
          className="text-blue-600 hover:underline text-sm"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
