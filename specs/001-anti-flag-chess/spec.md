# Feature Specification: Anti-Flag Timed Chess Web App

**Feature Branch**: `001-anti-flag-chess`
**Created**: 2025-12-09
**Status**: Draft
**Scope Tier**: MVP (per constitution)

## Overview

A real-time online chess web app implementing the Anti-Flag timing variant. Players have a fixed time per turn with a grace period; if time expires without a move, the system automatically plays a random move (preferring pawn moves) rather than causing a loss. This keeps games paced and tense without the frustration of "flagging" losses.

## Clarifications

### Session 2025-12-09

- Q: How are colors (White/Black) assigned to players? → A: Host chooses their color when creating the game.
- Q: What piece does auto-move promote a pawn to? → A: Randomly select from Queen, Rook, Bishop, Knight.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Configure a Game (Priority: P1)

A player wants to host a new Anti-Flag Chess game with their preferred timing settings and invite an opponent to join.

**Why this priority**: Without game creation, no gameplay is possible. This is the entry point for all other functionality.

**Independent Test**: Can be fully tested by creating a game, configuring settings, and verifying the game lobby displays correctly with a shareable link. Delivers immediate value by enabling game setup.

**Acceptance Scenarios**:

1. **Given** a player is on the home screen, **When** they click "Create Game", **Then** they see a configuration screen with timing options.

2. **Given** a player is on the game configuration screen, **When** they set per-turn time to 60 seconds, grace period to 2 seconds, Auto-move timeout behavior, and choose to play as White, **Then** these settings are displayed and confirmed before game creation.

3. **Given** a player has configured game settings, **When** they click "Create Game", **Then** a game lobby is created and a shareable invite link is generated.

4. **Given** a game lobby exists, **When** the host views the lobby, **Then** they see the configured settings, "Waiting for opponent" status, and the invite link to share.

---

### User Story 2 - Join an Existing Game (Priority: P1)

A player receives an invite link and wants to join their friend's Anti-Flag Chess game.

**Why this priority**: Equally critical as game creation; two players are required for gameplay.

**Independent Test**: Can be tested by using an invite link to join a waiting game lobby and verifying both players see the game is ready to start.

**Acceptance Scenarios**:

1. **Given** a player has a valid invite link, **When** they open the link, **Then** they are taken to the game lobby as the opponent.

2. **Given** a player joins a game lobby, **When** the lobby has both players, **Then** the game automatically starts with White's turn.

3. **Given** a player has an invalid or expired invite link, **When** they open the link, **Then** they see an error message indicating the game is unavailable.

---

### User Story 3 - Play a Complete Game with Standard Timing (Priority: P1)

Two players want to play a full game of Anti-Flag Chess, making moves within the per-turn time limit and experiencing normal gameplay flow.

**Why this priority**: Core gameplay experience; the primary value proposition of the app.

**Independent Test**: Can be tested by two players making alternating legal moves, observing timer countdown, and playing to checkmate, stalemate, or draw.

**Acceptance Scenarios**:

1. **Given** a game has started, **When** it is a player's turn, **Then** their per-turn timer counts down from the configured time while the opponent's timer is inactive.

2. **Given** it is a player's turn, **When** they select a piece, **Then** all legal moves for that piece are highlighted on the board.

3. **Given** it is a player's turn, **When** they make a legal move within the time limit, **Then** the move is applied, the board updates, and the turn switches to the opponent.

4. **Given** a king is in check, **When** the board displays, **Then** the check is visually indicated.

5. **Given** a game reaches checkmate, **When** the final position is achieved, **Then** the game ends and displays the winner.

6. **Given** a game reaches stalemate or a draw condition, **When** the condition is detected, **Then** the game ends and displays the draw result.

---

### User Story 4 - Experience Grace Period and Auto-Move (Priority: P1)

A player runs out of per-turn time and experiences the Anti-Flag grace period and auto-move system.

**Why this priority**: The defining feature of Anti-Flag Chess; differentiates this variant from standard timed chess.

**Independent Test**: Can be tested by letting a turn timer expire and observing grace period countdown followed by auto-move execution.

**Acceptance Scenarios**:

1. **Given** it is a player's turn, **When** their per-turn time reaches 0, **Then** the grace period countdown begins with a distinct visual style (e.g., flashing or red).

2. **Given** a player is in grace period, **When** they make a legal move before grace expires, **Then** the move is accepted normally and play continues.

3. **Given** a player is in grace period with Auto-move mode configured, **When** the grace period expires without a move and legal pawn moves exist, **Then** a random pawn move is automatically played with clear visual indication.

4. **Given** a player is in grace period with Auto-move mode configured, **When** the grace period expires without a move and no legal pawn moves exist, **Then** a random legal move is automatically played with clear visual indication.

5. **Given** a player is in grace period with Lose-on-time mode configured, **When** the grace period expires without a move, **Then** that player loses the game immediately with a clear message.

---

### User Story 5 - Resign or Offer Draw (Priority: P2)

A player wants to end the game early by resigning or offering a draw to their opponent.

**Why this priority**: Important for user experience but not required for core gameplay loop.

**Independent Test**: Can be tested by one player resigning and verifying game ends with correct result, or by testing draw offer/accept/decline flow.

**Acceptance Scenarios**:

1. **Given** a game is in progress, **When** a player clicks "Resign", **Then** they are asked to confirm the resignation.

2. **Given** a player confirms resignation, **When** the resignation is processed, **Then** the game ends and the opponent is declared the winner.

3. **Given** a game is in progress, **When** a player offers a draw, **Then** the opponent sees the draw offer.

4. **Given** a draw offer is pending, **When** the opponent accepts, **Then** the game ends in a draw.

5. **Given** a draw offer is pending, **When** the opponent declines, **Then** the game continues and the offering player is notified.

---

### User Story 6 - Reconnect to an Active Game (Priority: P2)

A player loses connection during a game and wants to rejoin.

**Why this priority**: Important for user experience in real-world network conditions but game can function without it initially.

**Independent Test**: Can be tested by disconnecting a player mid-game and reconnecting to verify game state is restored.

**Acceptance Scenarios**:

1. **Given** a player disconnects during an active game, **When** they return to the game URL, **Then** they rejoin the game with the current board state and timers.

2. **Given** a player disconnects during their turn, **When** the turn timer or grace period expires, **Then** the auto-move or loss-on-time rule applies as normal.

3. **Given** a player reconnects, **When** the game resumes, **Then** the timers resync to the current server state.

---

### Edge Cases

- What happens when a player has no legal moves? The game ends in checkmate (if in check) or stalemate (if not in check); auto-move does not trigger.
- What happens when a player disconnects permanently? The game continues with their timer running; repeated auto-moves or time losses apply until game ends or reconnect timeout expires.
- What happens when both players disconnect? The game state is preserved for a reasonable period (e.g., 5 minutes) allowing either to reconnect.
- What happens when a player attempts an illegal move? The move is rejected, the piece returns to its original position, and the timer continues.
- What happens when a player's browser tab loses focus? Timers continue server-side; client display resyncs when focus returns.
- What happens with slow network causing move delay? Server validates timestamp; if move was made before timeout on client but arrives after, server decides based on authoritative timestamp.

## Requirements *(mandatory)*

### Functional Requirements

**Game Creation & Lobby**

- **FR-001**: System MUST allow a player to create a new game with configurable settings.
- **FR-002**: System MUST provide per-turn time configuration from 10 seconds to 5 minutes (default: 60 seconds).
- **FR-003**: System MUST provide grace period configuration from 0 to 5 seconds (default: 2 seconds).
- **FR-004**: System MUST provide timeout behavior toggle: "Auto-move" (default) or "Lose on time".
- **FR-004a**: System MUST allow the host to choose their color (White or Black) when creating the game; the joining player receives the opposite color.
- **FR-005**: System MUST generate a unique shareable invite link for each created game.
- **FR-006**: System MUST allow a second player to join via the invite link.
- **FR-007**: System MUST start the game automatically when two players are present.

**Chess Rules & Board**

- **FR-008**: System MUST enforce standard chess rules for all moves (legal moves only).
- **FR-009**: System MUST detect and display check, checkmate, and stalemate.
- **FR-010**: System MUST detect and end games on draw conditions: threefold repetition, 50-move rule, insufficient material.
- **FR-011**: System MUST display an 8x8 board with clear piece graphics.
- **FR-012**: System MUST highlight legal moves when a piece is selected.
- **FR-013**: System MUST prevent illegal moves including moving into or remaining in check.
- **FR-014**: System MUST indicate whose turn it is.

**Timing System**

- **FR-015**: System MUST display a countdown timer for the current player's turn.
- **FR-016**: System MUST keep the non-active player's timer display inactive/paused.
- **FR-017**: System MUST start grace period countdown when per-turn time reaches 0.
- **FR-018**: System MUST display grace period with visually distinct styling (e.g., red/flashing).
- **FR-019**: System MUST accept moves made during grace period as normal moves.
- **FR-020**: Timer logic MUST be server-authoritative; client timers display only.

**Auto-Move System (when configured)**

- **FR-021**: System MUST execute auto-move when grace period expires with no player move (in Auto-move mode).
- **FR-022**: Auto-move MUST prefer a random legal pawn move if any exists.
- **FR-022a**: When auto-move results in pawn promotion, the system MUST randomly select the promotion piece from Queen, Rook, Bishop, or Knight.
- **FR-023**: Auto-move MUST select a random legal move (any piece) if no pawn moves exist.
- **FR-024**: System MUST display clear indication when auto-move occurs (e.g., "Random pawn move played due to time").

**Lose-on-Time Mode (when configured)**

- **FR-025**: System MUST end the game with a loss for the player whose grace period expires (in Lose-on-time mode).
- **FR-026**: System MUST display clear indication of time loss result.

**Game End & Actions**

- **FR-027**: System MUST allow a player to resign with confirmation.
- **FR-028**: System MUST allow a player to offer a draw.
- **FR-029**: System MUST allow the opponent to accept or decline a draw offer.
- **FR-030**: System MUST end the game and display results for: checkmate, stalemate, draw, resignation, or time loss.

**Connectivity**

- **FR-031**: System MUST synchronize game state in real-time between both players.
- **FR-032**: System MUST allow players to reconnect to an active game.
- **FR-033**: System MUST restore current game state and resync timers on reconnection.
- **FR-034**: System MUST preserve game state for disconnected games for at least 5 minutes.

**User Interface**

- **FR-035**: System MUST be usable on desktop and mobile web browsers.
- **FR-036**: System MUST use minimal, clear visual design per style-minimal.md guidelines.
- **FR-037**: System MUST display game configuration summary in pre-game screen (e.g., "Mode: Anti-Flag Timed Chess, 60s/turn, 2s grace, Auto-move on timeout").

### Key Entities

- **Game**: Represents a chess match instance. Contains game ID, game settings, current board state, move history, game status (waiting/active/ended), result, and timestamps.

- **Game Settings**: Configuration for a game. Contains per-turn time limit, grace period duration, and timeout behavior mode.

- **Player Session**: A player's connection to a game. Contains session identifier, assigned color (white/black), connection status, and last activity timestamp.

- **Board State**: Current position of all pieces. Contains piece positions, whose turn, castling rights, en passant target, halfmove clock (50-move rule), and fullmove number.

- **Move**: A single chess move. Contains from-square, to-square, piece moved, captured piece (if any), promotion piece (if any), timestamp, and whether it was an auto-move.

- **Timer State**: Current timing information. Contains remaining turn time, grace period status, and last sync timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create and configure a game in under 30 seconds.
- **SC-002**: Users can join a game via invite link in under 10 seconds.
- **SC-003**: Game board updates reflect moves within 500ms of the move being made (perceived real-time).
- **SC-004**: Timer displays are accurate within 1 second of server state.
- **SC-005**: Auto-move executes within 1 second of grace period expiring.
- **SC-006**: System handles 100 concurrent active games without degradation.
- **SC-007**: 95% of users complete their first game without encountering errors.
- **SC-008**: Game state correctly persists through player reconnection 99% of the time.
- **SC-009**: All standard chess rules (check, checkmate, stalemate, draws) are correctly enforced 100% of the time.
- **SC-010**: Mobile web users report equivalent experience to desktop users.

## Assumptions

- Users have modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions).
- Users have stable internet connections suitable for real-time gameplay (minor latency is tolerable, extended disconnections are handled by reconnection flow).
- Games are played between two human players; AI opponents are out of scope for MVP.
- No user accounts required for MVP; players are identified by session only.
- No game persistence beyond active session; completed games are not stored for history in MVP.
- No matchmaking; players share invite links directly.
- Default pre-game settings (60s turn time, 2s grace, Auto-move mode) are shown as the recommended "Anti-Flag Chess" experience.

## Non-Goals (Explicitly Out of Scope for MVP)

- User accounts, authentication, or profiles
- Game history or replay functionality
- Ratings, rankings, or matchmaking
- AI opponents
- Spectator mode
- Multiple game variants
- Anti-cheat or engine detection
- Native mobile apps (web responsive is in scope)
- Sound effects or animations beyond minimal feedback
- Chat between players
