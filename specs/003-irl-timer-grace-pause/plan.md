# Implementation Plan: IRL Chess Timer - Grace Period and Pause Behavior

**Branch**: `003-irl-timer-grace-pause` | **Date**: 2025-12-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-irl-timer-grace-pause/spec.md`

## Summary

Add configurable grace period (1-5 seconds) and timeout behavior settings to the IRL Chess Timer. When a player's timer reaches zero, the system enters a grace period with urgent visual feedback (full-screen pulsing red overlay, accelerating pulse, negative time display). After grace period expires, the system either auto-switches to the other player ("Continue playing") or pauses the game ("Pause game") based on user configuration.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14+, React 18+, Tailwind CSS, Zustand (local state)
**Storage**: N/A (client-side only, no persistence beyond session)
**Testing**: Manual testing (existing pattern for IRL timer)
**Target Platform**: Web browser (mobile-first responsive design)
**Project Type**: Monorepo with web application
**Performance Goals**: Timer accuracy within 100ms, UI response within 100ms of input
**Constraints**: Client-side only, must work offline, mobile touch-friendly (44px+ touch targets)
**Scale/Scope**: Single-user local timer, no network requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Server Authority | N/A | IRL timer is explicitly client-side only per spec scope |
| II. Incremental Delivery | PASS | Feature adds to existing MVP timer, clear scope boundaries |
| III. Separation of Concerns | PASS | Timer logic in store, UI in components, no networking |
| IV. Library Integration | PASS | Uses existing Zustand store pattern, no new libraries needed |
| V. Clarity Over Flash | PASS | Grace period provides obvious visual feedback (red pulse, negative time) |
| VI. Mobile-Ready Core | PASS | Timer logic remains in TypeScript store, portable |

**Gate Result**: PASS - No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/003-irl-timer-grace-pause/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # N/A - no API contracts for client-side feature
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
apps/web/src/
├── app/timer/
│   └── page.tsx                    # Setup screen (MODIFY: add grace/timeout config)
├── components/
│   ├── irl-timer-display.tsx       # Timer display (MODIFY: handle negative time)
│   ├── irl-timer-controls.tsx      # Control buttons (no changes needed)
│   ├── irl-paused-overlay.tsx      # Pause overlay (MODIFY: add timeout context)
│   └── irl-grace-overlay.tsx       # NEW: Full-screen grace period overlay
├── hooks/
│   └── useIRLTimer.ts              # Timer tick logic (MODIFY: grace period handling)
└── lib/
    ├── store/
    │   └── irl-timer-store.ts      # Zustand store (MODIFY: add grace state)
    └── types/
        └── irl-timer.ts            # Type definitions (MODIFY: add grace types)
```

**Structure Decision**: Extends existing IRL timer architecture. No new directories needed. One new component (grace overlay), modifications to existing files.

## Complexity Tracking

> No Constitution violations - this section is empty.

## Phase 0: Research Summary

### Decision 1: Grace Period State Tracking

**Decision**: Track grace period state within the existing `PlayerTimer` interface and add session-level `isInGracePeriod` flag.

**Rationale**: Follows existing pattern where each player's timer state is contained in `PlayerTimer`. The session needs to know when grace period is active to show the overlay.

**Alternatives Rejected**:
- Separate grace timer object: Adds complexity, not needed for client-side timer
- Only negative time tracking: Doesn't give clear signal for overlay display

### Decision 2: Accelerating Pulse Implementation

**Decision**: Use CSS animation with decreasing `animation-duration` based on elapsed grace time. Start at 1s pulse duration, accelerate to 0.2s at expiry.

**Rationale**: CSS animations are performant and the accelerating pattern creates urgency. Formula: `duration = 1.0 - (elapsedRatio * 0.8)` where elapsedRatio is 0→1.

**Alternatives Rejected**:
- JavaScript-driven opacity changes: Higher CPU, less smooth
- Fixed pulse rate: Less urgent feeling, doesn't communicate time passing

### Decision 3: Negative Time Display Format

**Decision**: Display as "-Xs" format (e.g., "-1s", "-2s", "-3s") to match whole seconds.

**Rationale**: Spec explicitly defines this format. Simple, clear, distinguishable from positive time. Matches the display at 0:00 which shows just seconds.

**Alternatives Rejected**:
- "-0:02" format: More complex parsing, less urgent appearance
- Fractional seconds: Too detailed for the urgency context

### Decision 4: Timeout Pause Overlay Enhancement

**Decision**: Extend existing `IrlPausedOverlay` with optional context parameter to show "TIME EXPIRED" message when auto-paused after grace period.

**Rationale**: Reuses existing overlay component, adds minimal code, maintains visual consistency.

**Alternatives Rejected**:
- Separate timeout overlay component: Duplicates code
- Modal instead of overlay: Different UX pattern than existing pause

## Phase 1: Design

### Data Model Changes

See [data-model.md](./data-model.md) for complete type definitions.

**Summary of changes to existing types**:

1. **TimerConfiguration** - Add two new fields:
   - `gracePeriodSeconds: 1 | 2 | 3 | 4 | 5` (default: 2)
   - `timeoutBehavior: 'continue' | 'pause'` (default: 'continue')

2. **TimerSession** - Add grace period tracking:
   - `isInGracePeriod: boolean`
   - `graceElapsedMs: number` (tracks how long in grace period)
   - `graceTriggerPlayer: PlayerColor | null` (which player triggered grace)

3. **Constants** - Add grace period thresholds:
   - `GRACE_PERIOD_SECONDS_OPTIONS = [1, 2, 3, 4, 5]`
   - `DEFAULT_GRACE_PERIOD_SECONDS = 2`
   - `DEFAULT_TIMEOUT_BEHAVIOR = 'continue'`

### Component Architecture

1. **IrlGraceOverlay** (NEW)
   - Full-screen fixed position overlay
   - Red background with accelerating pulse animation
   - Displays negative time in center
   - Shows "TAP TO SWITCH" instruction
   - z-index above timer displays, below modal overlays

2. **IrlTimerDisplay** (MODIFY)
   - Handle negative `remainingMs` values
   - Format as "-Xs" when negative
   - Apply different styling when in grace period

3. **IrlPausedOverlay** (MODIFY)
   - Accept optional `timeoutContext` prop
   - When present, show "TIME EXPIRED" header and which player's time ran out
   - Unpause resets expired player's timer

4. **Timer Setup Page** (MODIFY)
   - Add grace period slider (1-5 seconds)
   - Add timeout behavior toggle/selector

### Hook Logic Changes

**useIRLTimer hook modifications**:

```typescript
// In tick handler:
if (remainingMs <= 0 && !isInGracePeriod) {
  // Enter grace period
  enterGracePeriod();
}

if (isInGracePeriod) {
  // Track grace elapsed time
  graceElapsedMs += elapsed;

  // Check if grace expired
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

### Store Actions

New actions in `irl-timer-store.ts`:

- `setGracePeriod(seconds: number)` - Update config
- `setTimeoutBehavior(behavior: 'continue' | 'pause')` - Update config
- `enterGracePeriod()` - Set grace state, record trigger player
- `exitGracePeriod()` - Clear grace state
- `tickGrace(elapsedMs: number)` - Update grace elapsed time
- `pauseWithTimeout()` - Pause with timeout context

New derived getters:

- `getGraceRemainingMs()` - Returns remaining grace time
- `getGraceProgress()` - Returns 0-1 ratio for animation timing
