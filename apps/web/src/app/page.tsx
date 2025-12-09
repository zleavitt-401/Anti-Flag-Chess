'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <h1 className="text-4xl font-bold text-center">
        Anti-Flag Chess
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-md">
        Real-time chess with anti-flag timing. No more flagging losses -
        if you run out of time, a random move is played for you.
      </p>
      <Link
        href="/create"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Create Game
      </Link>

      <div className="mt-8 text-sm text-gray-500 max-w-md text-center">
        <h2 className="font-semibold text-gray-700 mb-2">How it works:</h2>
        <ul className="space-y-1">
          <li>Each player has a fixed time per turn</li>
          <li>A grace period gives you extra seconds after time runs out</li>
          <li>If you still don&apos;t move, a random pawn move is played automatically</li>
          <li>No more losing on time - the game keeps going!</li>
        </ul>
      </div>
    </div>
  );
}
