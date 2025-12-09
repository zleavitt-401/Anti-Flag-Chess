# Implementation Plan: Anti-Flag Timed Chess Web App

**Branch**: `001-anti-flag-chess` | **Date**: 2025-12-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-anti-flag-chess/spec.md`

## Summary

Build a real-time online chess web app implementing the Anti-Flag timing variant. Players have configurable per-turn time (10s-5min) with grace period (0-5s); on timeout, system auto-moves (random pawn preferred) or player loses (configurable). Core architecture separates pure TypeScript game logic from React UI and WebSocket networking to enable future mobile ports.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14+, React 18+, chess.js, react-chessboard, socket.io, Tailwind CSS, Zustand
**Storage**: In-memory game state + Redis for active games (MVP may use in-memory only)
**Testing**: Vitest (unit), Playwright (E2E)
**Target Platform**: Web (desktop + mobile browsers), Node.js server
**Project Type**: Web application (Next.js monorepo with shared core package)
**Performance Goals**: <500ms move sync, <1s timer accuracy, 100 concurrent games
**Constraints**: Server-authoritative timers, stateless app instances, single region MVP
**Scale/Scope**: MVP targets 100 concurrent games, 2 players per game

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. Server Authority | Timer logic server-side, server validates all moves | ✅ PASS |
| II. Incremental Delivery | MVP scope defined, Secondary/Future deferred | ✅ PASS |
| III. Separation of Concerns | Core game module separate from UI and networking | ✅ PASS |
| IV. Library Integration | Using chess.js for rules, react-chessboard for UI | ✅ PASS |
| V. Clarity Over Flash | Distinct timer displays, clear timeout feedback | ✅ PASS |
| VI. Mobile-Ready Core | Pure TypeScript core module, no browser APIs | ✅ PASS |

**All gates pass. Proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-anti-flag-chess/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (WebSocket events, REST endpoints)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/
├── core/                    # Pure TypeScript game logic (mobile-ready)
│   ├── src/
│   │   ├── game/           # Game state, rules integration
│   │   ├── timer/          # Turn timer, grace period logic
│   │   ├── auto-move/      # Random move selection
│   │   └── types/          # Shared type definitions
│   └── tests/
│       └── unit/

apps/
├── web/                     # Next.js application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components (board, timers, lobby)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Client utilities
│   │   └── styles/         # Tailwind config, global styles
│   └── tests/
│       └── e2e/

├── server/                  # WebSocket server (may be integrated into Next.js or separate)
│   ├── src/
│   │   ├── handlers/       # WebSocket event handlers
│   │   ├── rooms/          # Game room management
│   │   └── services/       # Game orchestration, timer service
│   └── tests/
│       ├── integration/
│       └── unit/
```

**Structure Decision**: Monorepo with three packages:
1. `packages/core` - Pure TypeScript game logic (Constitution VI: Mobile-Ready Core)
2. `apps/web` - Next.js frontend application
3. `apps/server` - WebSocket server for real-time game sync

This structure enforces separation of concerns (Constitution III) and enables future mobile reuse of core logic.

## Complexity Tracking

> No constitution violations requiring justification.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Monorepo structure | 3 packages | Required by Constitution III (separation) and VI (portable core) |
| WebSocket server | Separate from Next.js API | Cleaner timer management, easier to scale independently |
