# Anti-Flag Chess - Bugs and Fixes

This document tracks bugs discovered during development and testing, along with their solutions.

---

## Bug #1: Server ESM Module Resolution Failure

**Discovered:** Initial testing
**Symptom:** Server crashes on startup with:
```
SyntaxError: The requested module '@anti-flag-chess/core' does not provide an export named 'DEFAULT_GAME_SETTINGS'
```

**Root Cause:** The `packages/core` package was missing the `"type": "module"` field in package.json, causing ESM resolution to fail.

**Fix:** Added `"type": "module"` to `packages/core/package.json`.

**Files Changed:**
- `packages/core/package.json`

---

## Bug #2: Host Not Receiving game_start Event

**Discovered:** Two-player testing
**Symptom:** When a second player joins a game, the host's screen stays in the waiting lobby instead of transitioning to the game board. Console shows multiple socket disconnect/reconnect cycles.

**Root Cause:** When a Socket.IO socket reconnects, it receives a new socket ID and is NOT automatically rejoined to any rooms it was previously in. The host's socket would disconnect and reconnect, losing its membership in the game room, so it never received the `game_start` broadcast.

**Fix:** Added automatic room rejoin logic in the connection handler. When a socket connects with an existing session ID that has an active game, the server automatically:
1. Rejoins the socket to the game room
2. Updates the player's socket ID in the game store
3. Sends an `active_game_found` event with current game state

**Files Changed:**
- `apps/server/src/handlers/index.ts`

---

## Bug #3: Grace Period Not Visible / Auto-Move Notification Stuck

**Discovered:** Gameplay testing
**Symptom:**
1. Grace period seemed to happen immediately after timer expired (no visible delay)
2. Auto-move notification appeared but never dismissed

**Root Cause (Grace Period):** The timer sync (sent every 100ms) was always sending `isGracePeriod: false` and `graceTimeRemaining: 0`, overwriting the actual grace period state on the client.

**Root Cause (Notification):** The `AutoMoveNotification` component's `useEffect` had `onDismiss` in its dependency array. Since `onDismiss` was an inline arrow function, it changed on every render, causing the effect to re-run and reset the timer repeatedly.

**Fix (Grace Period):** Updated the timer sync to include actual grace period state from the `TimerController`:
- Server's `broadcastTimerSync` now accepts and sends `isGracePeriod` and `graceTimeRemaining`
- Client's `useTimerSync` hook now reads these values from the server instead of hardcoding them

**Fix (Notification):** Changed from `useState` to `useRef` for the timeout, and removed `onDismiss` from the useEffect dependency array (only depend on `isVisible`).

**Files Changed:**
- `apps/server/src/rooms/game-room.ts` - Updated `broadcastTimerSync` signature
- `apps/server/src/services/timer-service.ts` - Pass grace period info to broadcast
- `apps/web/src/hooks/useTimerSync.ts` - Use grace period from server
- `apps/web/src/components/auto-move-notification.tsx` - Fixed auto-dismiss logic

---

## Bug #4: Chess Move Matching Wrong Piece

**Discovered:** Gameplay testing
**Symptom:** When clicking to move a piece, sometimes a different piece would move to the target square instead of the piece the player selected.

**Root Cause:** The move matching logic used `m.includes(square)` to find a legal move from the SAN notation list. This matched ANY move containing the target square, not necessarily from the selected piece. For example, selecting a knight on g1 and clicking f3 could match `Bf3` (bishop) instead of `Nf3` (knight) if the bishop move appeared first in the array.

```typescript
// BAD: This matches any move containing the target square
const matchingMove = boardState.legalMoves.find((m) => {
  return m.includes(square) || m === moveAttempt;
});
```

**Fix:** Changed to send moves in UCI format (`from+to`, e.g., `e2e4`) instead of trying to match SAN notation. Chess.js's permissive parser handles UCI notation natively, correctly identifying the exact move intended.

```typescript
// GOOD: Send exact from+to squares
const uciMove = `${selectedSquare}${square}`;
onMove(uciMove);
```

**Files Changed:**
- `apps/web/src/components/chess-board.tsx` - Both `handleSquareClick` and `handleDrop` now use UCI format

---

## Enhancement: Grace Period Visual Indicator

**Request:** Add a visual indicator when a player must move during grace period
**Solution:** Created `GracePeriodOverlay` component that shows:
- Pulsing orange border around the entire screen
- "MOVE NOW!" message with countdown

**Files Created:**
- `apps/web/src/components/grace-period-overlay.tsx`

**Files Changed:**
- `apps/web/src/components/active-game.tsx` - Added GracePeriodOverlay component

---

## Bug #5: Grace Period Overlay Shown to Both Players

**Discovered:** Gameplay testing
**Symptom:** During grace period, BOTH players saw the full-screen pulsing orange border effect. This confused the opponent because it made them feel like THEY needed to do something urgent.

**Root Cause:** The `GracePeriodOverlay` component only checked `isActive` before rendering the overlay, showing it to both players.

**Fix:** Added `!isMyTurn` check so the urgent overlay only shows to the player whose turn it is. The opponent still sees the red "Grace Period!" indicator on the timer component.

```tsx
// Before
if (!isActive) return null;

// After
if (!isActive || !isMyTurn) return null;
```

**Files Changed:**
- `apps/web/src/components/grace-period-overlay.tsx`

---

## Bug #6: Moves Not Working After UCI Fix

**Discovered:** Gameplay testing after Bug #4 fix
**Symptom:** After changing the client to send UCI notation, no moves work at all. Console shows "Move error" for every attempt.

**Root Cause:** The `isLegalMove` function in `GameState` only checked if the move was in `chess.moves()` which returns SAN notation. Since we're now sending UCI notation from the client, the validation always failed.

```typescript
// Before - only checked SAN list
isLegalMove(san: string): boolean {
  const moves = this.chess.moves();
  return moves.includes(san);
}
```

**Fix:** Updated `isLegalMove` to try parsing the move with chess.js's permissive parser (which handles UCI) after checking the SAN list:

```typescript
// After - checks SAN first, then tries UCI via chess.js
isLegalMove(moveStr: string): boolean {
  const moves = this.chess.moves();
  if (moves.includes(moveStr)) {
    return true;
  }
  // Try parsing with chess.js permissive parser on a copy
  try {
    const chessCopy = new Chess(this.chess.fen());
    const result = chessCopy.move(moveStr);
    return result !== null;
  } catch {
    return false;
  }
}
```

**Files Changed:**
- `packages/core/src/game/game-state.ts`

---

## Debug Logging Added

For troubleshooting timer and auto-move issues, debug logging was added to:
- `apps/server/src/index.ts` - Grace expired handler
- `apps/server/src/services/timer-service.ts` - Timer events

These logs can be removed or made conditional once the system is stable.
