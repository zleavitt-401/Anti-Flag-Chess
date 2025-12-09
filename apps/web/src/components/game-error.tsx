'use client';

import { useRouter } from 'next/navigation';

interface GameErrorProps {
  message: string;
}

export function GameError({ message }: GameErrorProps) {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">Game Unavailable</h2>
      <p className="text-gray-600 mb-6">{message}</p>

      <div className="space-y-3">
        <button
          onClick={() => router.push('/create')}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Game
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
