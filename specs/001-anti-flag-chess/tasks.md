# Tasks: Anti-Flag Timed Chess Web App

**Input**: Design documents from `/specs/001-anti-flag-chess/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md monorepo structure:
- **Core package**: `packages/core/src/`
- **Web app**: `apps/web/src/`
- **Server**: `apps/server/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and monorepo structure

- [x] T001 Initialize monorepo with pnpm workspaces and turbo.json at repository root
- [x] T002 Create packages/core directory structure with src/{game,timer,auto-move,types} folders
- [x] T003 [P] Initialize packages/core/package.json with chess.js, typescript, vitest dependencies
- [x] T004 [P] Create packages/core/tsconfig.json with strict mode configuration
- [x] T005 Create apps/web using Next.js 14+ with App Router in apps/web/
- [x] T006 [P] Add react-chessboard, socket.io-client, zustand, @tanstack/react-query to apps/web
- [x] T007 [P] Configure Tailwind CSS in apps/web/tailwind.config.ts
- [x] T008 Create apps/server directory structure with src/{handlers,rooms,services} folders
- [x] T009 [P] Initialize apps/server/package.json with socket.io, express, nanoid dependencies
- [x] T010 [P] Create apps/server/tsconfig.json configuration
- [x] T011 Configure workspace dependencies linking @anti-flag-chess/core to apps/web and apps/server
- [x] T012 [P] Create root package.json scripts for dev, build, and test across all packages

**Checkpoint**: Monorepo structure ready, all packages can build independently

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Core Package Types

- [x] T013 [P] Define GameSettings interface in packages/core/src/types/game-settings.ts
- [x] T014 [P] Define GameStatus, GameResult, GameEndReason types in packages/core/src/types/game-state.ts
- [x] T015 [P] Define BoardState interface in packages/core/src/types/board-state.ts
- [x] T016 [P] Define Move, PieceType, PromotionPiece types in packages/core/src/types/move.ts
- [x] T017 [P] Define TimerState interface in packages/core/src/types/timer-state.ts
- [x] T018 [P] Define PlayerSession interface in packages/core/src/types/player-session.ts
- [x] T019 Create packages/core/src/types/index.ts exporting all type definitions

### Core Package Game Logic

- [x] T020 Implement GameState class wrapping chess.js in packages/core/src/game/game-state.ts
- [x] T021 [P] Implement settings validation in packages/core/src/game/validate-settings.ts
- [x] T022 Implement BoardStateManager deriving BoardState from chess.js in packages/core/src/game/board-state-manager.ts

### Core Package Timer Logic

- [x] T023 Implement TurnTimer class with start/stop/reset in packages/core/src/timer/turn-timer.ts
- [x] T024 Implement GracePeriodTimer class in packages/core/src/timer/grace-timer.ts
- [x] T025 Implement TimerController orchestrating turn and grace timers in packages/core/src/timer/timer-controller.ts

### Core Package Auto-Move

- [x] T026 Implement selectAutoMove function (pawn-priority, random) in packages/core/src/auto-move/select-move.ts
- [x] T027 Implement random promotion selection in packages/core/src/auto-move/random-promotion.ts

### Server Infrastructure

- [x] T028 Create Express server setup with socket.io in apps/server/src/index.ts
- [x] T029 [P] Implement in-memory GameStore (Map-based) in apps/server/src/services/game-store.ts
- [x] T030 [P] Implement SessionStore for session-to-game mapping in apps/server/src/services/session-store.ts
- [x] T031 Implement GameRoom class for socket.io room management in apps/server/src/rooms/game-room.ts

### Web App Infrastructure

- [x] T032 Create socket.io client connection hook in apps/web/src/hooks/useSocket.ts
- [x] T033 [P] Create Zustand game store in apps/web/src/lib/store/game-store.ts
- [x] T034 [P] Implement session ID generation and localStorage persistence in apps/web/src/lib/session.ts
- [x] T035 Create base layout with minimal styling in apps/web/src/app/layout.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create and Configure a Game (Priority: P1) 🎯 MVP

**Goal**: Host can create a game with custom timing settings and get an invite link

**Independent Test**: Create a game, verify lobby displays with settings and shareable link

### Server Implementation for US1

- [x] T036 [US1] Implement create_game WebSocket handler in apps/server/src/handlers/create-game.ts
- [x] T037 [US1] Implement game ID generation with nanoid in apps/server/src/services/game-id.ts
- [x] T038 [US1] Implement invite link generation in apps/server/src/services/invite-link.ts
- [x] T039 [US1] Register create_game handler in apps/server/src/handlers/index.ts

### Web App Implementation for US1

- [x] T040 [US1] Create home page with "Create Game" button in apps/web/src/app/page.tsx
- [x] T041 [US1] Create GameConfigForm component with timing inputs in apps/web/src/components/game-config-form.tsx
- [x] T042 [US1] Implement turn time slider (10s-5min) in apps/web/src/components/turn-time-slider.tsx
- [x] T043 [P] [US1] Implement grace period slider (0-5s) in apps/web/src/components/grace-period-slider.tsx
- [x] T044 [P] [US1] Implement timeout behavior toggle in apps/web/src/components/timeout-behavior-toggle.tsx
- [x] T045 [P] [US1] Implement color picker (White/Black) in apps/web/src/components/color-picker.tsx
- [x] T046 [US1] Create game lobby page at apps/web/src/app/game/[gameId]/page.tsx
- [x] T047 [US1] Create WaitingLobby component showing settings and invite link in apps/web/src/components/waiting-lobby.tsx
- [x] T048 [US1] Implement useCreateGame hook connecting to socket in apps/web/src/hooks/useCreateGame.ts
- [x] T049 [US1] Add copy-to-clipboard for invite link in apps/web/src/components/invite-link-display.tsx

**Checkpoint**: User Story 1 complete - can create games and share invite links

---

## Phase 4: User Story 2 - Join an Existing Game (Priority: P1)

**Goal**: Opponent can join via invite link and game starts automatically

**Independent Test**: Open invite link, join lobby, verify game starts with both players

### Server Implementation for US2

- [x] T050 [US2] Implement join_game WebSocket handler in apps/server/src/handlers/join-game.ts
- [x] T051 [US2] Implement game_start event broadcast in apps/server/src/handlers/join-game.ts
- [x] T052 [US2] Add validation for game-not-found, game-full, already-started errors in apps/server/src/handlers/join-game.ts
- [x] T053 [US2] Register join_game handler in apps/server/src/handlers/index.ts

### Web App Implementation for US2

- [x] T054 [US2] Implement useJoinGame hook in apps/web/src/hooks/useJoinGame.ts
- [x] T055 [US2] Update game page to handle join flow in apps/web/src/app/game/[gameId]/page.tsx
- [x] T056 [US2] Create error display for invalid/expired links in apps/web/src/components/game-error.tsx
- [x] T057 [US2] Create GameStarting transition component in apps/web/src/components/game-starting.tsx

**Checkpoint**: User Stories 1 AND 2 complete - two players can connect and start a game

---

## Phase 5: User Story 3 - Play a Complete Game (Priority: P1)

**Goal**: Full gameplay with moves, timer countdown, and game end detection

**Independent Test**: Play a game to checkmate/stalemate/draw, verify all moves and timers work

### Server Implementation for US3

- [ ] T058 [US3] Implement make_move WebSocket handler in apps/server/src/handlers/make-move.ts
- [ ] T059 [US3] Implement move validation using core GameState in apps/server/src/services/move-validator.ts
- [ ] T060 [US3] Implement move_made broadcast with updated board state in apps/server/src/handlers/make-move.ts
- [ ] T061 [US3] Implement server-side TimerService using core TimerController in apps/server/src/services/timer-service.ts
- [ ] T062 [US3] Implement timer_sync periodic broadcast (100ms) in apps/server/src/services/timer-service.ts
- [ ] T063 [US3] Implement game end detection (checkmate, stalemate, draw) in apps/server/src/services/game-end-detector.ts
- [ ] T064 [US3] Implement game_over event broadcast in apps/server/src/handlers/game-over.ts
- [ ] T065 [US3] Register make_move and game event handlers in apps/server/src/handlers/index.ts

### Web App Implementation for US3

- [ ] T066 [US3] Create ChessBoard component wrapping react-chessboard in apps/web/src/components/chess-board.tsx
- [ ] T067 [US3] Implement legal move highlighting on piece selection in apps/web/src/components/chess-board.tsx
- [ ] T068 [US3] Implement check indication styling in apps/web/src/components/chess-board.tsx
- [ ] T069 [US3] Create TurnTimer display component in apps/web/src/components/turn-timer.tsx
- [ ] T070 [US3] Implement timer countdown with server sync in apps/web/src/hooks/useTimerSync.ts
- [ ] T071 [US3] Create TurnIndicator component in apps/web/src/components/turn-indicator.tsx
- [ ] T072 [US3] Create GameOverModal component with result display in apps/web/src/components/game-over-modal.tsx
- [ ] T073 [US3] Implement useMakeMove hook in apps/web/src/hooks/useMakeMove.ts
- [ ] T074 [US3] Create ActiveGame container component in apps/web/src/components/active-game.tsx
- [ ] T075 [US3] Integrate all gameplay components in game page apps/web/src/app/game/[gameId]/page.tsx

**Checkpoint**: User Stories 1, 2, AND 3 complete - full basic gameplay works

---

## Phase 6: User Story 4 - Grace Period and Auto-Move (Priority: P1)

**Goal**: Anti-Flag timing with grace period and automatic random moves

**Independent Test**: Let timer expire, verify grace countdown, then auto-move executes

### Server Implementation for US4

- [ ] T076 [US4] Implement grace period trigger on turn time expiry in apps/server/src/services/timer-service.ts
- [ ] T077 [US4] Implement grace_started event broadcast in apps/server/src/services/timer-service.ts
- [ ] T078 [US4] Implement auto-move execution on grace expiry using core selectAutoMove in apps/server/src/services/auto-move-service.ts
- [ ] T079 [US4] Implement auto_move event broadcast with move details in apps/server/src/handlers/auto-move.ts
- [ ] T080 [US4] Implement lose-on-time mode handling in apps/server/src/services/timer-service.ts
- [ ] T081 [US4] Register auto_move and grace handlers in apps/server/src/handlers/index.ts

### Web App Implementation for US4

- [ ] T082 [US4] Create GracePeriodTimer component with distinct styling (red/flashing) in apps/web/src/components/grace-period-timer.tsx
- [ ] T083 [US4] Implement grace period visual transition in apps/web/src/components/turn-timer.tsx
- [ ] T084 [US4] Create AutoMoveNotification component in apps/web/src/components/auto-move-notification.tsx
- [ ] T085 [US4] Implement useGracePeriod hook handling grace_started events in apps/web/src/hooks/useGracePeriod.ts
- [ ] T086 [US4] Add auto-move indication on board (highlight moved piece) in apps/web/src/components/chess-board.tsx
- [ ] T087 [US4] Create TimeLossNotification for lose-on-time mode in apps/web/src/components/time-loss-notification.tsx

**Checkpoint**: All P1 stories complete - core Anti-Flag Chess experience works

---

## Phase 7: User Story 5 - Resign or Offer Draw (Priority: P2)

**Goal**: Players can resign or offer/accept/decline draws

**Independent Test**: Resign a game, offer draw and accept, offer draw and decline

### Server Implementation for US5

- [ ] T088 [US5] Implement resign WebSocket handler in apps/server/src/handlers/resign.ts
- [ ] T089 [US5] Implement offer_draw WebSocket handler in apps/server/src/handlers/draw-offer.ts
- [ ] T090 [US5] Implement respond_draw WebSocket handler in apps/server/src/handlers/draw-response.ts
- [ ] T091 [US5] Implement DrawOffer tracking in GameStore in apps/server/src/services/game-store.ts
- [ ] T092 [US5] Register resign and draw handlers in apps/server/src/handlers/index.ts

### Web App Implementation for US5

- [ ] T093 [US5] Create GameActions component with resign/draw buttons in apps/web/src/components/game-actions.tsx
- [ ] T094 [US5] Create ResignConfirmModal component in apps/web/src/components/resign-confirm-modal.tsx
- [ ] T095 [US5] Create DrawOfferModal for offering draws in apps/web/src/components/draw-offer-modal.tsx
- [ ] T096 [US5] Create DrawReceivedModal for accepting/declining in apps/web/src/components/draw-received-modal.tsx
- [ ] T097 [US5] Implement useResign hook in apps/web/src/hooks/useResign.ts
- [ ] T098 [US5] Implement useDrawOffer hook in apps/web/src/hooks/useDrawOffer.ts

**Checkpoint**: User Story 5 complete - players can end games early

---

## Phase 8: User Story 6 - Reconnect to Active Game (Priority: P2)

**Goal**: Disconnected players can rejoin and resume gameplay

**Independent Test**: Disconnect during game, refresh page, verify state restored

### Server Implementation for US6

- [ ] T099 [US6] Implement rejoin_game WebSocket handler in apps/server/src/handlers/rejoin-game.ts
- [ ] T100 [US6] Implement disconnect event handler tracking player status in apps/server/src/handlers/disconnect.ts
- [ ] T101 [US6] Implement opponent_disconnected broadcast in apps/server/src/handlers/disconnect.ts
- [ ] T102 [US6] Implement opponent_reconnected broadcast in apps/server/src/handlers/rejoin-game.ts
- [ ] T103 [US6] Implement active_game_found on socket connection in apps/server/src/handlers/connection.ts
- [ ] T104 [US6] Implement game state preservation timer (5 min) in apps/server/src/services/game-store.ts
- [ ] T105 [US6] Register reconnection handlers in apps/server/src/handlers/index.ts

### Web App Implementation for US6

- [ ] T106 [US6] Implement socket.io auto-reconnect configuration in apps/web/src/hooks/useSocket.ts
- [ ] T107 [US6] Create ConnectionStatus component in apps/web/src/components/connection-status.tsx
- [ ] T108 [US6] Create OpponentDisconnected notification in apps/web/src/components/opponent-disconnected.tsx
- [ ] T109 [US6] Implement useReconnect hook handling active_game_found in apps/web/src/hooks/useReconnect.ts
- [ ] T110 [US6] Implement state resync on reconnection in apps/web/src/hooks/useGameSync.ts

**Checkpoint**: All user stories complete

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T111 [P] Add responsive styles for mobile layout in apps/web/src/app/globals.css
- [ ] T112 [P] Implement error boundary component in apps/web/src/components/error-boundary.tsx
- [ ] T113 Create loading states for all async operations in apps/web/src/components/loading-spinner.tsx
- [ ] T114 [P] Add API health check endpoint in apps/server/src/routes/health.ts
- [ ] T115 [P] Add game metadata REST endpoint (GET /api/game/:id) in apps/server/src/routes/game.ts
- [ ] T116 Implement proper error messages for all WebSocket error codes in apps/web/src/lib/error-messages.ts
- [ ] T117 [P] Add console logging for server events in apps/server/src/lib/logger.ts
- [ ] T118 Run quickstart.md validation - verify all setup steps work
- [ ] T119 Final code cleanup and unused import removal across all packages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational, integrates with US1
- **User Story 3 (Phase 5)**: Depends on Foundational, integrates with US1+US2
- **User Story 4 (Phase 6)**: Depends on US3 (timer infrastructure)
- **User Story 5 (Phase 7)**: Depends on US3 (active game infrastructure)
- **User Story 6 (Phase 8)**: Depends on US3 (game state infrastructure)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

```
Phase 2 (Foundational)
       │
       ▼
    ┌──────────────────────────────────────┐
    │                                      │
    ▼                                      ▼
 US1 (Create) ──────► US2 (Join) ──────► US3 (Play)
                                           │
                      ┌────────────────────┼────────────────────┐
                      │                    │                    │
                      ▼                    ▼                    ▼
                US4 (Auto-Move)      US5 (Resign/Draw)    US6 (Reconnect)
```

### Parallel Opportunities

**Phase 1 (Setup)**: T003, T004, T006, T007, T009, T010, T012 can run in parallel

**Phase 2 (Foundational)**: T013-T018 can run in parallel (types), T029-T030 can run in parallel

**Per User Story**: Tasks marked [P] within each story can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all type definitions in parallel:
Task T013: "Define GameSettings interface in packages/core/src/types/game-settings.ts"
Task T014: "Define GameStatus, GameResult types in packages/core/src/types/game-state.ts"
Task T015: "Define BoardState interface in packages/core/src/types/board-state.ts"
Task T016: "Define Move types in packages/core/src/types/move.ts"
Task T017: "Define TimerState interface in packages/core/src/types/timer-state.ts"
Task T018: "Define PlayerSession interface in packages/core/src/types/player-session.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1-4)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Create Game)
4. Complete Phase 4: User Story 2 (Join Game)
5. Complete Phase 5: User Story 3 (Play Game)
6. Complete Phase 6: User Story 4 (Auto-Move)
7. **STOP and VALIDATE**: Core Anti-Flag Chess experience works
8. Deploy/demo MVP

### Incremental Delivery (Add P2 Stories)

9. Add Phase 7: User Story 5 (Resign/Draw)
10. Add Phase 8: User Story 6 (Reconnection)
11. Complete Phase 9: Polish
12. Full feature complete

### Suggested MVP Scope

**Minimum viable product = User Stories 1-4 (P1 only)**:
- Create game with settings ✓
- Join via invite link ✓
- Play with timers ✓
- Auto-move on timeout ✓

This delivers the core Anti-Flag Chess experience. P2 stories (resign, draw, reconnect) can be added in subsequent iterations.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are relative to repository root
