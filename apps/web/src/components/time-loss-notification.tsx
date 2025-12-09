'use client';

interface TimeLossNotificationProps {
  player: 'white' | 'black';
  playerColor: 'white' | 'black';
}

export function TimeLossNotification({ player, playerColor }: TimeLossNotificationProps) {
  const isPlayerLoss = player === playerColor;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">
          {isPlayerLoss ? 'Time Ran Out!' : 'Opponent Timed Out!'}
        </h2>
        <p className="text-gray-600 mb-4">
          {isPlayerLoss
            ? 'You lost on time. The game has ended.'
            : `${player === 'white' ? 'White' : 'Black'} ran out of time. You win!`}
        </p>
        <div
          className={`w-8 h-8 mx-auto rounded-full ${
            player === 'white' ? 'bg-white border-2 border-gray-300' : 'bg-gray-800'
          }`}
        />
      </div>
    </div>
  );
}
