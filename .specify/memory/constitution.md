<!--
Sync Impact Report:
- Version change: N/A → 1.0.0 (initial constitution)
- Added principles: I. Server Authority, II. Incremental Delivery, III. Separation of Concerns, IV. Library Integration, V. Clarity Over Flash, VI. Mobile-Ready Core
- Added sections: Product Goals, Tech Stack Defaults, Game Domain Constraints, Scope Tiers
- Templates requiring updates: None (initial setup)
- Follow-up TODOs: None
-->

# Anti-Flag Timed Chess Constitution

## Product Goals

Deliver a playable, stable online chess experience focused on the Anti-Flag per-turn timing system. Prioritize clarity, simplicity, and responsiveness over feature richness. Architecture MUST enable future AI opponents and mobile ports of core game logic.

## Core Principles

### I. Server Authority

The server (or authoritative backend) is the single source of truth. All decisions regarding board state, turn order, timer expiration, grace period enforcement, and auto-move selection MUST originate server-side. Clients MAY display optimistic UI updates, but the server validates and confirms all moves. Timer logic MUST NOT live only on the client.

**Rationale**: Prevents cheating, ensures consistency across reconnects, and simplifies conflict resolution.

### II. Incremental Delivery

Every feature starts as an MVP slice. Specs MUST define concrete scope tiers (MVP, Secondary, Future) and avoid vague "support everything" requirements. A shippable increment is more valuable than a comprehensive plan. Horizontal scalability, advanced matchmaking, and AI opponents are explicitly deferred beyond MVP.

**Rationale**: A small indie developer cannot ship everything at once. Focused slices reduce risk and enable early feedback.

### III. Separation of Concerns

The codebase MUST maintain clear boundaries:

- **Core game module**: Pure TypeScript for rules, state, timing logic. No UI, no networking.
- **UI layer**: React components, styling, user interaction. No game rule logic.
- **Networking layer**: WebSocket handlers, move transmission, timer sync. No chess rules.

**Rationale**: Enables mobile porting (reuse core module), simplifies testing, and isolates change impact.

### IV. Library Integration

Use well-tested libraries for solved problems. Chess rules MUST use an existing JS/TS library (e.g., chess.js-style behavior) for legal move generation, check/checkmate/stalemate detection, and draw conditions. Chessboard UI SHOULD use an existing React library (e.g., react-chessboard) unless specific requirements demand customization.

**Rationale**: Reimplementing chess rules invites subtle bugs and wastes time.

### V. Clarity Over Flash

UI MUST prioritize clarity and accessibility. Per-turn countdown and grace countdown MUST be visually distinct. State changes (time hit 0, grace running, auto-move occurred, time loss) MUST provide obvious feedback. Avoid visual complexity that obscures game state.

**Rationale**: The timing variant is the core differentiator; players need immediate understanding of time state.

### VI. Mobile-Ready Core

The core game logic module MUST remain portable: no browser-specific APIs, no framework dependencies, pure TypeScript. This module handles board state, move validation, turn management, timing rules, and auto-move selection. It MUST be independently testable without a browser or server context.

**Rationale**: Future mobile ports and AI integration depend on reusable core logic.

## Tech Stack Defaults

Specs MUST assume these defaults unless explicitly overridden with justification:

### Frontend

| Aspect | Default |
|--------|---------|
| Framework | React with Next.js (latest stable) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Server state | React Query |
| Local state | React context or Zustand (lightweight; avoid heavy global stores for MVP) |
| Chess UI | react-chessboard or equivalent |
| Chess rules | chess.js or equivalent TypeScript library |

### Backend

| Aspect | Default |
|--------|---------|
| Runtime | Node.js |
| Language | TypeScript |
| API layer | Next.js API routes (or Express/Fastify for dedicated service) |
| Real-time | WebSockets via socket.io or native ws |
| Persistence | In-memory + Redis for active games; simple DB for history (MVP may skip DB) |
| Architecture | Stateless instances, game state anchored centrally |

### Infrastructure

| Aspect | Default |
|--------|---------|
| Deployment | Vercel for Next.js, managed Redis |
| Region | Single region for MVP |
| Scaling | Deferred; design for stateless horizontal scale, do not implement yet |

## Game Domain Constraints

These rules are non-negotiable for the Anti-Flag variant:

### Base Chess Rules

- Standard chess: legal moves only, check, checkmate, stalemate
- Standard draw conditions: 50-move rule, threefold repetition, insufficient material
- Players lose by checkmate, resignation, agreed draw, or (if enabled) time loss

### Variant Timing

- No global game clock
- Per-turn time limit: configurable 10 seconds to 5 minutes, same for both players
- Grace period: configurable 0 to 5 seconds
- Timeout behavior (configurable before game):
  - **Auto-move mode (Anti-Flag default)**: On grace expiry, system selects a random legal pawn move if one exists; otherwise, a random legal move
  - **Lose-on-time mode**: Player loses immediately on grace expiry

### Timer Authority

Timer countdown, grace countdown, and timeout enforcement MUST occur server-side. Client timers are display-only and resync on server events.

## Scope Tiers

### MVP (High Priority)

- Human vs human online 1v1
- Game creation via lobby or direct link (simple invite flow)
- Core Anti-Flag timing: per-turn timer, grace period, configurable timeout behavior
- Stable chess rules integration (legal moves, check/checkmate, draws)
- Clear UI: board, move highlighting, check indication, distinct timer displays, timeout feedback

### Secondary (Medium Priority)

- Move list / game history display
- Rematch / play again flow
- Basic user identity: anonymous or simple account (email/OAuth)
- Recent games list (no ratings)

### Future (Low Priority, Explicitly Deferred)

- AI opponent mode (external engine integration)
- Ratings and matchmaking
- Complex lobbies and spectator mode
- Mobile app (shared core logic)
- Anti-cheat / engine detection

Specs MUST explicitly label scope tier for every requirement. MVP features ship first; Secondary features may be included if time permits; Future features MUST NOT block MVP.

## Architecture Principles

### Resilience to Latency

- Client shows optimistic moves; server validates and broadcasts confirmation
- Reconnection MUST restore current game state without data loss
- Timer drift between client and server handled by periodic resync from server

### Testability

- Core game module: unit tests for rules, timing logic, auto-move selection
- Integration tests: WebSocket message flows, timer events
- E2E tests: critical user flows (create game, play to checkmate/timeout)

### Simplicity

- Avoid abstractions without immediate need (YAGNI)
- Prefer direct solutions over patterns added for hypothetical future requirements
- Complexity MUST be justified in plan documents

## Governance

This constitution governs all feature specifications, implementation plans, and code reviews for Anti-Flag Chess.

- **Compliance**: All PRs and design reviews MUST verify adherence to these principles
- **Amendments**: Changes require documented rationale, updated version, and review of dependent artifacts
- **Hierarchy**: Constitution supersedes conflicting practices in other documents
- **Version Policy**: MAJOR for principle removals or redefinitions; MINOR for new sections or expanded guidance; PATCH for clarifications

**Version**: 1.0.0 | **Ratified**: 2025-12-09 | **Last Amended**: 2025-12-09
