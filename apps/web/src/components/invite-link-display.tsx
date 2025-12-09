'use client';

import { useState } from 'react';

interface InviteLinkDisplayProps {
  link: string;
}

export function InviteLinkDisplay({ link }: InviteLinkDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Invite Link</label>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={link}
          className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm font-mono"
        />
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
