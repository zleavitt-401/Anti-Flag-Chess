/**
 * Generates an invite link for a game.
 */
export function generateInviteLink(gameId: string, baseUrl?: string): string {
  const base = baseUrl || process.env.BASE_URL || 'http://localhost:3000';
  return `${base}/game/${gameId}`;
}

/**
 * Extracts game ID from an invite link.
 */
export function extractGameIdFromLink(link: string): string | null {
  try {
    const url = new URL(link);
    const match = url.pathname.match(/\/game\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  } catch {
    // Not a valid URL, try simple path extraction
    const match = link.match(/\/game\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  }
}
