'use client';

import { useEffect, useState } from 'react';

interface AutoMoveNotificationProps {
  isVisible: boolean;
  player: 'white' | 'black';
  onDismiss?: () => void;
}

export function AutoMoveNotification({ isVisible, player, onDismiss }: AutoMoveNotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        setShow(false);
        onDismiss?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <svg
          className="w-5 h-5"
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
        <span className="font-medium capitalize">{player}</span>
        <span>ran out of time - random move made!</span>
      </div>
    </div>
  );
}
