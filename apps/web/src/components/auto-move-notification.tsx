'use client';

import { useEffect, useRef } from 'react';

interface AutoMoveNotificationProps {
  isVisible: boolean;
  player: 'white' | 'black';
  onDismiss?: () => void;
}

export function AutoMoveNotification({ isVisible, player, onDismiss }: AutoMoveNotificationProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Auto-dismiss after 4 seconds
      timerRef.current = setTimeout(() => {
        onDismiss?.();
      }, 4000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isVisible]); // Only depend on isVisible, not onDismiss

  if (!isVisible) return null;

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
