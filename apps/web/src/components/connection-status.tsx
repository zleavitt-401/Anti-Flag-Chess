'use client';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  if (isConnected) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 text-sm z-50">
      <div className="flex items-center justify-center gap-2">
        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
        <span>Reconnecting to server...</span>
      </div>
    </div>
  );
}
