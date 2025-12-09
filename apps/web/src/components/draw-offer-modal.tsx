'use client';

interface DrawOfferModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DrawOfferModal({ onConfirm, onCancel }: DrawOfferModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
        <h2 className="text-xl font-bold mb-4 text-center">Offer Draw?</h2>
        <p className="text-gray-600 mb-6 text-center">
          Would you like to offer a draw to your opponent? They can accept or decline.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Offer Draw
          </button>
        </div>
      </div>
    </div>
  );
}
