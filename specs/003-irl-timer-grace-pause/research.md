# Research: IRL Chess Timer - Grace Period and Pause Behavior

**Feature**: 003-irl-timer-grace-pause
**Date**: 2025-12-26

## Existing Implementation Analysis

### Current Timer Architecture

The IRL timer uses a client-side Zustand store with the following key components:

| Component | File | Purpose |
|-----------|------|---------|
| Store | `apps/web/src/lib/store/irl-timer-store.ts` | State management |
| Types | `apps/web/src/lib/types/irl-timer.ts` | Type definitions |
| Hook | `apps/web/src/hooks/useIRLTimer.ts` | Tick logic, audio |
| Display | `apps/web/src/components/irl-timer-display.tsx` | Visual countdown |
| Overlay | `apps/web/src/components/irl-paused-overlay.tsx` | Pause screen |

### Current Warning System

Existing thresholds defined in `irl-timer.ts`:
- `WARNING_THRESHOLD_MS = 10000` (10s) - Changes to warm/orange color
- `PULSE_THRESHOLD_MS = 5000` (5s) - Adds CSS `animate-pulse` at 0.5s duration
- `AUDIO_THRESHOLD_MS = 3000` (3s) - Plays audio countdown

### Current Auto-Switch Behavior

When timer reaches 0:
1. `expired` flag set to `true` on current player's timer
2. `remainingMs` stays at 0 (does not go negative)
3. Auto-switch to other player via `switchTurn()`
4. Expired player's timer resets to full time on their next turn

## Research Decisions

### Decision 1: Grace Period State Tracking

**Question**: How should grace period state be tracked in the store?

**Decision**: Add session-level fields plus extend PlayerTimer tracking.

**Rationale**:
- Session needs `isInGracePeriod` boolean for overlay visibility
- Session needs `graceElapsedMs` to track progress (for accelerating animation)
- Session needs `graceTriggerPlayer` to identify which player is in grace
- PlayerTimer's `remainingMs` can go negative during grace period

**Alternatives Considered**:
1. Separate `GraceState` object - Adds indirection without benefit
2. Only use negative `remainingMs` - No clear signal for overlay, harder to calculate animation timing
3. New session phase 'grace' - Would need to handle phase transitions differently

### Decision 2: Accelerating Pulse Animation

**Question**: How to implement accelerating pulse that speeds up during grace period?

**Decision**: Dynamic CSS animation-duration via inline style, calculated from grace progress.

**Implementation**:
```typescript
// Grace progress: 0 (just started) to 1 (about to expire)
const graceProgress = graceElapsedMs / gracePeriodMs;

// Pulse duration: 1000ms at start, 200ms at end
const pulseDuration = 1000 - (graceProgress * 800);
```

**Rationale**:
- CSS animations are GPU-accelerated
- Dynamic duration creates visceral urgency
- Simple linear interpolation is predictable

**Alternatives Considered**:
1. JavaScript-driven opacity - Higher CPU usage, less smooth
2. Multiple keyframe presets - Jumpy transitions between speeds
3. Web Animations API - More complex, browser support concerns

### Decision 3: Negative Time Display Format

**Question**: How should negative time be displayed during grace period?

**Decision**: Display as "-Xs" format (e.g., "-1s", "-2s", "-3s").

**Rationale**:
- Spec explicitly defines this format in FR-007
- Whole seconds are sufficient for 1-5 second grace periods
- Clear visual distinction from positive time
- Matches urgency context (not precise timing display)

**Implementation**:
```typescript
function formatTime(remainingMs: number): string {
  if (remainingMs < 0) {
    const negativeSeconds = Math.ceil(Math.abs(remainingMs) / 1000);
    return `-${negativeSeconds}s`;
  }
  // ... existing MM:SS formatting
}
```

### Decision 4: Timeout Pause Enhancement

**Question**: How to show timeout context in pause overlay?

**Decision**: Add optional `timeoutContext` prop to existing `IrlPausedOverlay`.

**Rationale**:
- Reuses existing component styling
- Minimal code changes
- Consistent UX with manual pause

**Implementation**:
```typescript
interface PausedOverlayProps {
  onResume: () => void;
  timeoutContext?: {
    expiredPlayer: PlayerColor;
  };
}
```

When `timeoutContext` is present:
- Show "TIME EXPIRED" header instead of "PAUSED"
- Show "{Color}'s time ran out" message
- Resume behavior resets expired player's timer

### Decision 5: Configuration UI Controls

**Question**: What UI controls to use for grace period and timeout settings?

**Decision**:
- Grace period: Slider with quick-select buttons (matching turn time slider pattern)
- Timeout behavior: Two-option toggle buttons (matching sound toggle pattern)

**Rationale**:
- Follows existing IRL timer setup UI patterns
- Users already understand these control types
- Mobile-friendly with adequate touch targets

## Integration Points

### Store Modifications

Add to `TimerConfiguration`:
```typescript
gracePeriodSeconds: 1 | 2 | 3 | 4 | 5;
timeoutBehavior: 'continue' | 'pause';
```

Add to `TimerSession`:
```typescript
isInGracePeriod: boolean;
graceElapsedMs: number;
graceTriggerPlayer: PlayerColor | null;
```

### Hook Modifications

The `useIRLTimer` hook's tick handler needs to:
1. Detect when `remainingMs <= 0` and not already in grace period
2. Enter grace period, start tracking grace elapsed time
3. Continue allowing `remainingMs` to go negative
4. Check if grace expired and execute timeout behavior

### Component Additions

New `IrlGraceOverlay` component:
- Fixed full-screen position
- Red background color `hsl(0, 60%, 20%)`
- Opacity animation for pulse effect
- Large negative time display in center
- "TAP TO SWITCH" instruction text
- Click/tap handler calls `switchTurn()` and exits grace

## Dependencies

No new external dependencies required. Feature uses:
- Existing Zustand store pattern
- Existing Tailwind CSS utilities
- Existing component styling patterns

## Testing Approach

Manual testing scenarios:
1. Configure grace period to each value (1-5s), verify correct duration
2. Let timer expire, verify red overlay appears immediately at 0
3. Verify pulse acceleration is noticeable
4. Tap during grace period, verify turn switches and grace ends
5. Let grace expire with "Continue" mode, verify auto-switch
6. Let grace expire with "Pause" mode, verify pause with context
7. Manual pause during grace period, verify grace ends cleanly
8. Verify expired player timer resets on next turn
