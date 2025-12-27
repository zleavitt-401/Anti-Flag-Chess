# Data Model: IRL Chess Timer - Grace Period and Pause Behavior

**Feature**: 003-irl-timer-grace-pause
**Date**: 2025-12-26

## Type Definitions

### New Types

```typescript
// Timeout behavior options
type TimeoutBehavior = 'continue' | 'pause';

// Grace period duration options (seconds)
type GracePeriodSeconds = 1 | 2 | 3 | 4 | 5;

// Context for timeout-triggered pause
interface TimeoutContext {
  expiredPlayer: PlayerColor;
}
```

### Modified Types

#### TimerConfiguration (Extended)

```typescript
interface TimerConfiguration {
  // Existing fields
  turnTimeSeconds: number;           // 10-300 seconds
  soundEnabled: boolean;
  soundType: SoundType;

  // New fields
  gracePeriodSeconds: GracePeriodSeconds;  // 1-5 seconds (default: 2)
  timeoutBehavior: TimeoutBehavior;        // 'continue' | 'pause' (default: 'continue')
}
```

#### TimerSession (Extended)

```typescript
interface TimerSession {
  // Existing fields
  phase: SessionPhase;              // 'setup' | 'playing' | 'paused' | 'ended'
  config: TimerConfiguration;
  white: PlayerTimer;
  black: PlayerTimer;
  activePlayer: PlayerColor;
  startedAt: number | null;
  endedAt: number | null;

  // New fields
  isInGracePeriod: boolean;              // True when active timer is in grace period
  graceElapsedMs: number;                // Milliseconds elapsed since grace started
  graceTriggerPlayer: PlayerColor | null; // Which player's timer triggered grace
  timeoutContext: TimeoutContext | null;  // Set when pause triggered by timeout
}
```

#### PlayerTimer (Unchanged in structure)

```typescript
interface PlayerTimer {
  color: PlayerColor;
  remainingMs: number;      // Can now be negative during grace period
  totalUsedMs: number;
  expired: boolean;
}
```

## Constants

```typescript
// Grace period options
export const GRACE_PERIOD_OPTIONS: GracePeriodSeconds[] = [1, 2, 3, 4, 5];
export const DEFAULT_GRACE_PERIOD_SECONDS: GracePeriodSeconds = 2;
export const DEFAULT_TIMEOUT_BEHAVIOR: TimeoutBehavior = 'continue';

// Grace period animation
export const GRACE_PULSE_START_MS = 1000;   // 1 second pulse at start
export const GRACE_PULSE_END_MS = 200;      // 0.2 second pulse at end
```

## State Transitions

### Grace Period Entry

**Trigger**: Active player's `remainingMs` reaches 0

**State Changes**:
```typescript
{
  isInGracePeriod: true,
  graceElapsedMs: 0,
  graceTriggerPlayer: activePlayer,
  [activePlayer].expired: true,
  // remainingMs continues counting negative
}
```

### Grace Period Exit - Player Tap

**Trigger**: Player taps timer during grace period

**State Changes**:
```typescript
{
  isInGracePeriod: false,
  graceElapsedMs: 0,
  graceTriggerPlayer: null,
  // switchTurn() called, resets expired player timer
}
```

### Grace Period Exit - Continue Mode

**Trigger**: `graceElapsedMs >= gracePeriodSeconds * 1000` with `timeoutBehavior === 'continue'`

**State Changes**:
```typescript
{
  isInGracePeriod: false,
  graceElapsedMs: 0,
  graceTriggerPlayer: null,
  // switchTurn() called, resets expired player timer
}
```

### Grace Period Exit - Pause Mode

**Trigger**: `graceElapsedMs >= gracePeriodSeconds * 1000` with `timeoutBehavior === 'pause'`

**State Changes**:
```typescript
{
  isInGracePeriod: false,
  graceElapsedMs: 0,
  graceTriggerPlayer: null,
  phase: 'paused',
  timeoutContext: { expiredPlayer: graceTriggerPlayer }
}
```

### Resume from Timeout Pause

**Trigger**: User taps resume when `timeoutContext` is set

**State Changes**:
```typescript
{
  phase: 'playing',
  timeoutContext: null,
  [timeoutContext.expiredPlayer].remainingMs: turnTimeMs,
  [timeoutContext.expiredPlayer].expired: false,
  activePlayer: opponent(timeoutContext.expiredPlayer)
}
```

## Derived Values

### Grace Progress (for animation)

```typescript
function getGraceProgress(session: TimerSession): number {
  if (!session.isInGracePeriod) return 0;
  const gracePeriodMs = session.config.gracePeriodSeconds * 1000;
  return Math.min(session.graceElapsedMs / gracePeriodMs, 1);
}
```

### Grace Pulse Duration

```typescript
function getGracePulseDuration(graceProgress: number): number {
  // Linear interpolation: 1000ms → 200ms as progress goes 0 → 1
  return GRACE_PULSE_START_MS - (graceProgress * (GRACE_PULSE_START_MS - GRACE_PULSE_END_MS));
}
```

### Negative Time Display

```typescript
function formatGraceTime(remainingMs: number): string {
  if (remainingMs >= 0) return null; // Not in grace
  const negativeSeconds = Math.ceil(Math.abs(remainingMs) / 1000);
  return `-${negativeSeconds}s`;
}
```

## Default Configuration

```typescript
const defaultConfig: TimerConfiguration = {
  turnTimeSeconds: 60,
  soundEnabled: true,
  soundType: 'woodBlock',
  gracePeriodSeconds: 2,        // NEW
  timeoutBehavior: 'continue',  // NEW
};
```

## Validation Rules

| Field | Rule |
|-------|------|
| `gracePeriodSeconds` | Must be 1, 2, 3, 4, or 5 |
| `timeoutBehavior` | Must be 'continue' or 'pause' |
| `graceElapsedMs` | Must be >= 0 |
| `isInGracePeriod` | Only true when `phase === 'playing'` |
| `graceTriggerPlayer` | Must be set when `isInGracePeriod === true` |
| `timeoutContext` | Only set when `phase === 'paused'` |

## Component Props

### IrlGraceOverlay Props

```typescript
interface IrlGraceOverlayProps {
  graceProgress: number;           // 0-1 for animation timing
  negativeTimeDisplay: string;     // e.g., "-2s"
  expiredPlayer: PlayerColor;      // For display purposes
  onTap: () => void;               // Calls switchTurn, exits grace
}
```

### IrlPausedOverlay Props (Extended)

```typescript
interface IrlPausedOverlayProps {
  onResume: () => void;
  timeoutContext?: TimeoutContext; // NEW - optional timeout info
}
```
