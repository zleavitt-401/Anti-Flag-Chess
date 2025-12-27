# Quickstart: IRL Chess Timer - Grace Period and Pause Behavior

**Feature**: 003-irl-timer-grace-pause
**Date**: 2025-12-26

## Overview

This feature adds configurable grace period and timeout behavior to the IRL Chess Timer. When a player's timer hits zero, they get a brief grace period with urgent visual feedback before the configured timeout behavior executes.

## Key Changes

| Component | Change Type | Purpose |
|-----------|-------------|---------|
| `irl-timer.ts` | Modify | Add grace period types and constants |
| `irl-timer-store.ts` | Modify | Add grace state tracking and actions |
| `useIRLTimer.ts` | Modify | Handle grace period tick logic |
| `irl-grace-overlay.tsx` | Create | Full-screen red pulse overlay |
| `irl-timer-display.tsx` | Modify | Handle negative time display |
| `irl-paused-overlay.tsx` | Modify | Add timeout context display |
| `timer/page.tsx` | Modify | Add configuration UI controls |

## Implementation Order

### Step 1: Types and Constants

Update `apps/web/src/lib/types/irl-timer.ts`:

```typescript
// Add new types
export type TimeoutBehavior = 'continue' | 'pause';
export type GracePeriodSeconds = 1 | 2 | 3 | 4 | 5;

// Add constants
export const GRACE_PERIOD_OPTIONS: GracePeriodSeconds[] = [1, 2, 3, 4, 5];
export const DEFAULT_GRACE_PERIOD_SECONDS: GracePeriodSeconds = 2;
export const DEFAULT_TIMEOUT_BEHAVIOR: TimeoutBehavior = 'continue';

// Extend TimerConfiguration interface
// Add: gracePeriodSeconds, timeoutBehavior

// Extend TimerSession interface
// Add: isInGracePeriod, graceElapsedMs, graceTriggerPlayer, timeoutContext
```

### Step 2: Store Updates

Update `apps/web/src/lib/store/irl-timer-store.ts`:

```typescript
// Add to initial state
isInGracePeriod: false,
graceElapsedMs: 0,
graceTriggerPlayer: null,
timeoutContext: null,

// Add new actions
setGracePeriod: (seconds) => { ... },
setTimeoutBehavior: (behavior) => { ... },
enterGracePeriod: () => { ... },
exitGracePeriod: () => { ... },
tickGrace: (elapsedMs) => { ... },
pauseWithTimeout: () => { ... },

// Update switchTurn to handle grace period exit
```

### Step 3: Hook Logic

Update `apps/web/src/hooks/useIRLTimer.ts`:

```typescript
// In tick handler, after updating remainingMs:
if (remainingMs <= 0 && !isInGracePeriod) {
  enterGracePeriod();
}

if (isInGracePeriod) {
  tickGrace(elapsed);

  if (graceElapsedMs >= gracePeriodMs) {
    exitGracePeriod();
    if (timeoutBehavior === 'continue') {
      switchTurn();
    } else {
      pauseWithTimeout();
    }
  }
}
```

### Step 4: Grace Overlay Component

Create `apps/web/src/components/irl-grace-overlay.tsx`:

```typescript
// Full-screen overlay with:
// - Red pulsing background (accelerating)
// - Large negative time display
// - "TAP TO SWITCH" instruction
// - Click handler to switch turn
```

### Step 5: Timer Display Updates

Update `apps/web/src/components/irl-timer-display.tsx`:

```typescript
// Handle negative remainingMs
if (remainingMs < 0) {
  const negativeSeconds = Math.ceil(Math.abs(remainingMs) / 1000);
  display = `-${negativeSeconds}s`;
}
```

### Step 6: Pause Overlay Updates

Update `apps/web/src/components/irl-paused-overlay.tsx`:

```typescript
// Add timeoutContext prop
// When present, show "TIME EXPIRED" and which player
```

### Step 7: Configuration UI

Update `apps/web/src/app/timer/page.tsx`:

```typescript
// Add grace period slider (1-5 seconds)
// Add timeout behavior toggle (Continue / Pause)
// Use existing slider and toggle component patterns
```

## Testing Checklist

- [ ] Grace period slider shows 1-5 options, defaults to 2
- [ ] Timeout behavior toggle shows Continue/Pause, defaults to Continue
- [ ] Timer counts into negative when hitting zero
- [ ] Red overlay appears immediately at 0:00
- [ ] Pulse accelerates as grace period progresses
- [ ] Negative time displays correctly (-1s, -2s, etc.)
- [ ] Tapping during grace switches turn and clears overlay
- [ ] Grace expiry with Continue mode auto-switches
- [ ] Grace expiry with Pause mode shows pause overlay with context
- [ ] Manual pause during grace period works correctly
- [ ] Expired player timer resets on their next turn

## Files to Create

1. `apps/web/src/components/irl-grace-overlay.tsx`

## Files to Modify

1. `apps/web/src/lib/types/irl-timer.ts`
2. `apps/web/src/lib/store/irl-timer-store.ts`
3. `apps/web/src/hooks/useIRLTimer.ts`
4. `apps/web/src/components/irl-timer-display.tsx`
5. `apps/web/src/components/irl-paused-overlay.tsx`
6. `apps/web/src/app/timer/page.tsx`

## No Changes Needed

- `irl-timer-controls.tsx` - Existing controls work as-is
- `irl-summary-modal.tsx` - No impact on game summary
- Audio system - Uses existing audio, no new sounds
