# Feature Specification: IRL Chess Timer - Grace Period and Pause Behavior

**Feature Branch**: `003-irl-timer-grace-pause`
**Created**: 2025-12-26
**Status**: Draft
**Input**: User description: "IRL Chess Timer grace period and pause behavior settings - adds configurable grace period (1-5 seconds) after timer expires with pulsing red screen and negative time display, plus configurable timeout behavior (continue playing or pause game)"

## Clarifications

### Session 2025-12-26

- Q: What is the red pulse animation timing during grace period? → A: Accelerating pulse (starts slow, speeds up as grace period ends)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure Grace Period and Timeout Behavior (Priority: P1)

A user setting up an IRL chess timer wants to configure how the timer behaves when time expires, including a grace period duration and what happens after the grace period ends.

**Why this priority**: Configuration must happen before gameplay begins. These settings fundamentally change how the timer behaves at the critical moment of time expiration.

**Independent Test**: Can be fully tested by accessing the timer setup screen at /timer and verifying the new configuration options appear and save correctly.

**Acceptance Scenarios**:

1. **Given** a user is on the timer setup screen, **When** they view the options, **Then** they see a grace period selector with options from 1 to 5 seconds (default: 2 seconds)
2. **Given** a user is on the setup screen, **When** they view the options, **Then** they see a timeout behavior selector with "Continue playing" (default) and "Pause game" options
3. **Given** a user selects a grace period of 3 seconds, **When** they start the game, **Then** the grace period setting is applied to timer expiration behavior
4. **Given** a user selects "Pause game" timeout behavior, **When** they start the game, **Then** the timeout behavior setting is applied when grace period expires

---

### User Story 2 - Experience Grace Period During Gameplay (Priority: P1)

When a player's timer reaches zero, they receive an urgent visual warning with negative time display during the grace period, giving them a last chance to tap before the configured timeout behavior executes.

**Why this priority**: This is the core feature - the grace period experience that gives players a last-chance window to complete their move.

**Independent Test**: Can be fully tested by letting a timer count down to zero and observing the grace period visual effects and negative time display.

**Acceptance Scenarios**:

1. **Given** a player's timer is counting down, **When** it reaches 0:00, **Then** the timer continues counting into negative time (e.g., -1s, -2s, -3s)
2. **Given** a player's timer has entered the grace period, **When** viewing the screen, **Then** the entire screen pulses red with an urgent visual effect
3. **Given** the grace period is set to 3 seconds, **When** the timer reaches 0:00, **Then** the grace period lasts exactly 3 seconds before timeout behavior executes
4. **Given** a player is in grace period, **When** they tap their timer area, **Then** the turn switches normally and the grace period ends immediately
5. **Given** a player is in grace period, **When** viewing the timer display, **Then** negative time is clearly visible (e.g., "-2s" or "-0:02")

---

### User Story 3 - Automatic Continue on Grace Period Expiry (Priority: P1)

When "Continue playing" is selected and the grace period expires, the game automatically switches to the other player's turn, preserving the current auto-switch behavior.

**Why this priority**: This is the default behavior and matches the existing timer functionality, ensuring backwards compatibility.

**Independent Test**: Can be fully tested by setting timeout behavior to "Continue playing", letting grace period expire, and verifying automatic turn switch.

**Acceptance Scenarios**:

1. **Given** timeout behavior is "Continue playing" and grace period is 2 seconds, **When** a player's timer reaches -2s, **Then** the timer automatically switches to the other player
2. **Given** the timer auto-switches after grace period, **When** the switch occurs, **Then** the previously expired player's timer shows 00:00 until their next turn
3. **Given** the timer auto-switched on a previous turn, **When** the opponent ends their turn, **Then** the expired player's timer resets to full turn time
4. **Given** the grace period red pulse is active, **When** the auto-switch occurs, **Then** the red pulsing effect stops immediately

---

### User Story 4 - Pause on Grace Period Expiry (Priority: P2)

When "Pause game" is selected and the grace period expires, the game pauses automatically, displaying a pause overlay until a player manually unpauses.

**Why this priority**: This is an alternative behavior for players who want more control over what happens when time runs out.

**Independent Test**: Can be fully tested by setting timeout behavior to "Pause game", letting grace period expire, and verifying the game pauses.

**Acceptance Scenarios**:

1. **Given** timeout behavior is "Pause game" and grace period is 2 seconds, **When** a player's timer reaches -2s, **Then** the game automatically pauses
2. **Given** the game has auto-paused after grace period, **When** viewing the screen, **Then** a pause overlay is displayed indicating which player's time expired
3. **Given** the game is auto-paused, **When** a player taps to unpause, **Then** the game resumes with the expired player's timer reset to full turn time
4. **Given** the game is auto-paused, **When** viewing the pause overlay, **Then** it clearly shows how to resume and that a timeout occurred

---

### Edge Cases

- What happens if a player taps during the grace period? (Turn switches normally, grace period ends immediately)
- What happens if the game is manually paused during grace period? (Grace period ends, game enters normal pause state)
- What happens if both settings dropdowns are left at defaults? (Grace period: 2 seconds, Timeout behavior: "Continue playing")
- How is negative time formatted? (Displayed as "-Xs" for whole seconds, e.g., "-1s", "-2s", "-3s")
- What happens if screen orientation changes during grace period? (Grace period continues uninterrupted, red pulse adapts to new orientation)
- What happens if device goes to sleep during grace period? (Timer pauses when tab loses focus, grace period resumes when returning)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a grace period duration selector on the setup screen with options 1, 2, 3, 4, and 5 seconds
- **FR-002**: System MUST default the grace period selector to 2 seconds
- **FR-003**: System MUST provide a timeout behavior selector on the setup screen with "Continue playing" and "Pause game" options
- **FR-004**: System MUST default the timeout behavior selector to "Continue playing"
- **FR-005**: System MUST continue counting into negative time when the active timer reaches 0:00
- **FR-006**: System MUST display a full-screen pulsing red overlay when the timer enters the grace period (negative time), with pulse frequency accelerating as the grace period progresses (starts slow, speeds up toward expiry)
- **FR-007**: System MUST display negative time in a clear format (e.g., "-1s", "-2s", "-3s") during the grace period
- **FR-008**: System MUST execute the configured timeout behavior when the negative time reaches the configured grace period limit
- **FR-009**: System MUST switch to the other player's timer when timeout behavior is "Continue playing" and grace period expires
- **FR-010**: System MUST pause the game with a descriptive overlay when timeout behavior is "Pause game" and grace period expires
- **FR-011**: System MUST stop the grace period immediately if the active player taps their timer during the grace period
- **FR-012**: System MUST stop the red pulsing effect when the grace period ends (by tap or expiry)
- **FR-013**: System MUST reset the expired player's timer to full turn time when their next turn begins (after auto-switch or unpause)
- **FR-014**: System MUST persist grace period and timeout behavior settings in the timer store during an active session
- **FR-015**: Pause overlay after auto-pause MUST indicate which player's time expired and provide clear instructions to resume

### Key Entities

- **GracePeriodConfig**: Grace period duration in seconds (1-5), part of TimerConfiguration
- **TimeoutBehavior**: Enum with values "continue" and "pause", part of TimerConfiguration
- **TimerSession**: Extended to track grace period state (whether currently in grace period, elapsed grace time)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can configure grace period and timeout behavior in the same screen as existing timer settings
- **SC-002**: The red pulsing overlay is visible and urgent from arm's length on mobile devices
- **SC-003**: Negative time display is clearly readable and distinguishable from positive time
- **SC-004**: Grace period duration is accurate within 100 milliseconds of configured time
- **SC-005**: Timeout behavior executes immediately (within 100ms) when grace period expires
- **SC-006**: Players can tap during grace period to end their turn without confusion or delay
- **SC-007**: Pause overlay after auto-pause clearly communicates what happened and how to resume

## Scope

### In Scope

- Add grace period setting (1-5 seconds) to IRL timer configuration
- Add timeout behavior setting (continue playing / pause game) to IRL timer configuration
- Implement pulsing red screen effect during grace period as full-screen overlay
- Show negative time display during grace period
- Execute chosen timeout behavior after grace period expires
- Integrate with existing pause/unpause functionality

### Out of Scope

- Grace period for online multiplayer mode (this feature is IRL timer only)
- Audio alerts during grace period (uses existing sound system, no new audio)
- Customizing red pulse animation style (single standard animation)
- Grace period duration above 5 seconds
- Mid-game configuration changes (settings are set before game start only)

## Assumptions

- Grace period uses the same client-side interval timing mechanism as the existing IRL timer
- Red pulsing effect is a full-screen overlay, not individual timer component styling
- Default grace period is 2 seconds (matching online mode's grace period behavior)
- Default timeout behavior is "Continue playing" (preserving current behavior as default)
- Settings are configured before game starts and cannot be changed mid-game
- Other player's timer always resets to full turn time when their turn begins (existing behavior maintained)
- Configuration UI uses dropdown/select components matching existing setup screen style
