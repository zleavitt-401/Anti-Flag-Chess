'use client';

interface GameStartingProps {
  playerColor: 'white' | 'black';
}

export function GameStarting({ playerColor }: GameStartingProps) {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-pulse">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2">Game Starting!</h2>
      <p className="text-gray-600 mb-4">
        You are playing as <span className="font-semibold capitalize">{playerColor}</span>
      </p>
      <p className="text-sm text-gray-500">
        {playerColor === 'white' ? 'You move first!' : 'Waiting for white to move...'}
      </p>

      <div className="mt-8 flex justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    </div>
  );
}
