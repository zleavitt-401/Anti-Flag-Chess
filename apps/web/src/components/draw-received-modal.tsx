'use client';

interface DrawReceivedModalProps {
  from: 'white' | 'black';
  onAccept: () => void;
  onDecline: () => void;
}

export function DrawReceivedModal({ from, onAccept, onDecline }: DrawReceivedModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
        <h2 className="text-xl font-bold mb-4 text-center">Draw Offered</h2>
        <p className="text-gray-600 mb-6 text-center">
          Your opponent (<span className="capitalize font-medium">{from}</span>) has offered a draw.
          Would you like to accept?
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onDecline}
            className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Accept Draw
          </button>
        </div>
      </div>
    </div>
  );
}
