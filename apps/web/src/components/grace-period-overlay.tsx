'use client';

interface GracePeriodOverlayProps {
  isActive: boolean;
  isMyTurn: boolean;
  graceTimeRemaining: number;
}

export function GracePeriodOverlay({ isActive, isMyTurn, graceTimeRemaining }: GracePeriodOverlayProps) {
  // Only show the urgent overlay to the player whose turn it is
  if (!isActive || !isMyTurn) return null;

  const seconds = Math.ceil(graceTimeRemaining / 1000);

  return (
    <>
      {/* Pulsing orange border overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          boxShadow: 'inset 0 0 60px 20px rgba(249, 115, 22, 0.6)',
          animation: 'pulse-border 0.5s ease-in-out infinite',
        }}
      />

      {/* Urgent message */}
      {isMyTurn && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-orange-600 text-white px-6 py-4 rounded-xl shadow-2xl text-center">
            <div className="text-2xl font-bold mb-1">MOVE NOW!</div>
            <div className="text-lg">
              {seconds > 0 ? `${seconds}s` : '<1s'} before auto-move
            </div>
          </div>
        </div>
      )}

      {/* Add the pulse animation */}
      <style jsx global>{`
        @keyframes pulse-border {
          0%, 100% {
            box-shadow: inset 0 0 60px 20px rgba(249, 115, 22, 0.6);
          }
          50% {
            box-shadow: inset 0 0 80px 30px rgba(249, 115, 22, 0.8);
          }
        }
      `}</style>
    </>
  );
}
