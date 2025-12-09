'use client';

interface GameActionsProps {
  onResign: () => void;
  onOfferDraw: () => void;
  isDisabled?: boolean;
  hasPendingDrawOffer?: boolean;
}

export function GameActions({
  onResign,
  onOfferDraw,
  isDisabled = false,
  hasPendingDrawOffer = false,
}: GameActionsProps) {
  return (
    <div className="flex gap-2 justify-center mt-4">
      <button
        onClick={onOfferDraw}
        disabled={isDisabled || hasPendingDrawOffer}
        className={`
          px-4 py-2 rounded-lg font-medium transition-colors
          ${
            isDisabled || hasPendingDrawOffer
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        {hasPendingDrawOffer ? 'Draw Offered' : 'Offer Draw'}
      </button>
      <button
        onClick={onResign}
        disabled={isDisabled}
        className={`
          px-4 py-2 rounded-lg font-medium transition-colors
          ${
            isDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }
        `}
      >
        Resign
      </button>
    </div>
  );
}
