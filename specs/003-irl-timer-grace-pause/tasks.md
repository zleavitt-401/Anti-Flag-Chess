# Tasks: IRL Chess Timer - Grace Period and Pause Behavior

**Input**: Design documents from `/specs/003-irl-timer-grace-pause/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

**Tests**: Not explicitly requested - manual testing per existing IRL timer pattern.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo structure**: `apps/web/src/` for web application
- Types: `apps/web/src/lib/types/`
- Store: `apps/web/src/lib/store/`
- Components: `apps/web/src/components/`
- Hooks: `apps/web/src/hooks/`
- Pages: `apps/web/src/app/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and constants that all user stories depend on

- [X] T001 Add grace period types (TimeoutBehavior, GracePeriodSeconds, TimeoutContext) in apps/web/src/lib/types/irl-timer.ts
- [X] T002 Add grace period constants (GRACE_PERIOD_OPTIONS, DEFAULT_GRACE_PERIOD_SECONDS, DEFAULT_TIMEOUT_BEHAVIOR, GRACE_PULSE_START_MS, GRACE_PULSE_END_MS) in apps/web/src/lib/types/irl-timer.ts
- [X] T003 Extend TimerConfiguration interface with gracePeriodSeconds and timeoutBehavior fields in apps/web/src/lib/types/irl-timer.ts
- [X] T004 Extend TimerSession interface with isInGracePeriod, graceElapsedMs, graceTriggerPlayer, and timeoutContext fields in apps/web/src/lib/types/irl-timer.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Store actions and hook logic that MUST be complete before any user story UI can work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Add grace period initial state values to store in apps/web/src/lib/store/irl-timer-store.ts
- [X] T006 Add setGracePeriod and setTimeoutBehavior config actions in apps/web/src/lib/store/irl-timer-store.ts
- [X] T007 Add enterGracePeriod action that sets isInGracePeriod, graceElapsedMs=0, and graceTriggerPlayer in apps/web/src/lib/store/irl-timer-store.ts
- [X] T008 Add exitGracePeriod action that clears grace state in apps/web/src/lib/store/irl-timer-store.ts
- [X] T009 Add tickGrace action to update graceElapsedMs in apps/web/src/lib/store/irl-timer-store.ts
- [X] T010 Add pauseWithTimeout action that sets phase to paused with timeoutContext in apps/web/src/lib/store/irl-timer-store.ts
- [X] T011 Add getGraceProgress derived getter (returns 0-1 ratio) in apps/web/src/lib/store/irl-timer-store.ts
- [X] T012 Update default config to include gracePeriodSeconds: 2 and timeoutBehavior: 'continue' in apps/web/src/lib/store/irl-timer-store.ts
- [X] T013 Modify tick handler to enter grace period when remainingMs <= 0 and not already in grace in apps/web/src/hooks/useIRLTimer.ts
- [X] T014 Modify tick handler to track grace elapsed time and check grace expiry in apps/web/src/hooks/useIRLTimer.ts
- [X] T015 Implement grace expiry logic: switchTurn for 'continue' mode, pauseWithTimeout for 'pause' mode in apps/web/src/hooks/useIRLTimer.ts
- [X] T016 Update switchTurn to exit grace period if active in apps/web/src/hooks/useIRLTimer.ts

**Checkpoint**: Foundation ready - all store actions and hook logic complete

---

## Phase 3: User Story 1 - Configure Grace Period and Timeout Behavior (Priority: P1) 🎯 MVP

**Goal**: Users can configure grace period (1-5s) and timeout behavior (continue/pause) on the timer setup screen

**Independent Test**: Access /timer setup screen, verify new configuration options appear with correct defaults (2s grace, Continue playing)

### Implementation for User Story 1

- [X] T017 [US1] Add grace period slider component section (1-5 seconds, default 2) following existing slider pattern in apps/web/src/app/timer/page.tsx
- [X] T018 [US1] Add timeout behavior toggle section ("Continue playing" / "Pause game", default Continue) following existing toggle pattern in apps/web/src/app/timer/page.tsx
- [X] T019 [US1] Wire up grace period slider to setGracePeriod store action in apps/web/src/app/timer/page.tsx
- [X] T020 [US1] Wire up timeout behavior toggle to setTimeoutBehavior store action in apps/web/src/app/timer/page.tsx
- [X] T021 [US1] Verify settings persist when starting game (startGame action preserves config) in apps/web/src/lib/store/irl-timer-store.ts

**Checkpoint**: User Story 1 complete - configuration UI works, settings apply to game

---

## Phase 4: User Story 2 - Experience Grace Period During Gameplay (Priority: P1)

**Goal**: When timer hits zero, show full-screen red pulsing overlay with negative time and allow tap to switch

**Independent Test**: Start game with 10s turn time, let timer hit zero, observe red pulsing overlay with negative time display, tap to switch

### Implementation for User Story 2

- [X] T022 [P] [US2] Create IrlGraceOverlay component with full-screen red background and centered content in apps/web/src/components/irl-grace-overlay.tsx
- [X] T023 [US2] Implement accelerating pulse animation using dynamic animation-duration based on graceProgress in apps/web/src/components/irl-grace-overlay.tsx
- [X] T024 [US2] Display negative time in "-Xs" format (e.g., "-2s") in center of overlay in apps/web/src/components/irl-grace-overlay.tsx
- [X] T025 [US2] Add "TAP TO SWITCH" instruction text in overlay in apps/web/src/components/irl-grace-overlay.tsx
- [X] T026 [US2] Add onClick handler that calls switchTurn and exitGracePeriod in apps/web/src/components/irl-grace-overlay.tsx
- [X] T027 [US2] Update formatTime helper to handle negative remainingMs and return "-Xs" format in apps/web/src/components/irl-timer-display.tsx
- [X] T028 [US2] Render IrlGraceOverlay in timer play page when isInGracePeriod is true in apps/web/src/app/timer/play/page.tsx

**Checkpoint**: User Story 2 complete - grace period visual experience works with tap to exit

---

## Phase 5: User Story 3 - Automatic Continue on Grace Period Expiry (Priority: P1)

**Goal**: When timeout behavior is "Continue playing" and grace expires, auto-switch to opponent

**Independent Test**: Configure "Continue playing" with 2s grace, let timer expire fully, observe auto-switch after 2 seconds of red pulsing

### Implementation for User Story 3

- [X] T029 [US3] Verify exitGracePeriod is called when grace expires in 'continue' mode in apps/web/src/hooks/useIRLTimer.ts
- [X] T030 [US3] Verify switchTurn resets expired player timer to full turn time on their next turn in apps/web/src/lib/store/irl-timer-store.ts
- [X] T031 [US3] Verify red pulsing overlay disappears immediately when grace exits in apps/web/src/app/timer/play/page.tsx

**Checkpoint**: User Story 3 complete - auto-switch behavior works correctly

---

## Phase 6: User Story 4 - Pause on Grace Period Expiry (Priority: P2)

**Goal**: When timeout behavior is "Pause game" and grace expires, pause with timeout context overlay

**Independent Test**: Configure "Pause game" with 2s grace, let timer expire, observe pause overlay showing which player's time expired

### Implementation for User Story 4

- [X] T032 [US4] Add timeoutContext prop to IrlPausedOverlay component interface in apps/web/src/components/irl-paused-overlay.tsx
- [X] T033 [US4] Display "TIME EXPIRED" header when timeoutContext is present in apps/web/src/components/irl-paused-overlay.tsx
- [X] T034 [US4] Display which player's time expired (e.g., "White's time ran out") when timeoutContext is present in apps/web/src/components/irl-paused-overlay.tsx
- [X] T035 [US4] Update resume handler to reset expired player timer and switch to opponent when timeoutContext exists in apps/web/src/lib/store/irl-timer-store.ts
- [X] T036 [US4] Pass timeoutContext from store to IrlPausedOverlay in timer play page in apps/web/src/app/timer/play/page.tsx
- [X] T037 [US4] Clear timeoutContext when resuming from timeout pause in apps/web/src/lib/store/irl-timer-store.ts

**Checkpoint**: User Story 4 complete - pause timeout behavior works with context display

---

## Phase 7: Polish & Edge Cases

**Purpose**: Handle edge cases and ensure robust behavior

- [X] T038 Handle manual pause during grace period: exitGracePeriod before entering normal pause state in apps/web/src/lib/store/irl-timer-store.ts
- [X] T039 Ensure grace period state is cleared in playAgain and backToSetup actions in apps/web/src/lib/store/irl-timer-store.ts
- [X] T040 Verify timer still pauses on tab/window blur during grace period (existing behavior) in apps/web/src/hooks/useIRLTimer.ts
- [ ] T041 Run through quickstart.md test scenarios and verify all pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1-US3 are all P1 priority - complete in order for MVP
  - US4 is P2 priority - can be done after US1-US3 or in parallel if staffed
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - Configuration UI only
- **User Story 2 (P1)**: Can start after Foundational - Grace overlay depends on store/hook logic
- **User Story 3 (P1)**: Depends on US2 (needs grace period to work to verify auto-switch)
- **User Story 4 (P2)**: Can start after Foundational - Independent of US3 but uses same hook logic

### Within Each User Story

- All [P] marked tasks can run in parallel within their phase
- Store actions before UI components
- Components before page integration

### Parallel Opportunities

- T022 (Create grace overlay) can run in parallel with other US2 tasks
- US1 (config UI) and US2 (grace overlay) can start in parallel after Foundational

---

## Parallel Example: Phase 2 (Foundational)

```bash
# These can run in parallel (different store sections):
Task: "Add setGracePeriod and setTimeoutBehavior config actions"
Task: "Add enterGracePeriod action"
Task: "Add exitGracePeriod action"

# These depend on above being complete:
Task: "Modify tick handler to enter grace period"
Task: "Modify tick handler to track grace elapsed time"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup (types and constants)
2. Complete Phase 2: Foundational (store actions and hook logic)
3. Complete Phase 3: User Story 1 (configuration UI)
4. Complete Phase 4: User Story 2 (grace period overlay)
5. Complete Phase 5: User Story 3 (auto-switch behavior)
6. **STOP and VALIDATE**: Test all MVP functionality manually
7. Deploy/demo MVP

### Add Pause Behavior (User Story 4)

1. Complete Phase 6: User Story 4 (pause timeout context)
2. Complete Phase 7: Polish and edge cases
3. Full feature complete

### Single Developer Strategy

1. Complete phases sequentially: 1 → 2 → 3 → 4 → 5 → 6 → 7
2. Each phase completion = commit checkpoint
3. After US3 complete = MVP ready for testing

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All timer logic uses existing 100ms tick interval
- Grace overlay uses CSS animation for performance
- Manual testing per existing IRL timer pattern
- Commit after each task or logical group
