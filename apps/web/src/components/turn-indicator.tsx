'use client';

interface TurnIndicatorProps {
  currentTurn: 'white' | 'black';
  playerColor: 'white' | 'black';
}

export function TurnIndicator({ currentTurn, playerColor }: TurnIndicatorProps) {
  const isYourTurn = currentTurn === playerColor;

  return (
    <div
      className={`
        text-center py-2 px-4 rounded-lg font-medium transition-all
        ${isYourTurn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
      `}
    >
      {isYourTurn ? (
        <span>Your turn</span>
      ) : (
        <span>Waiting for {currentTurn}...</span>
      )}
    </div>
  );
}
