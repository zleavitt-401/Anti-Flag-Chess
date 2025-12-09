# Research: Anti-Flag Timed Chess

**Feature**: 001-anti-flag-chess
**Date**: 2025-12-09

## Technology Decisions

### Chess Rules Library

**Decision**: chess.js (v1.0.0-beta or latest stable)

**Rationale**:
- Industry-standard JavaScript chess library
- Handles legal move generation, check/checkmate/stalemate detection
- Supports all draw conditions (50-move, threefold repetition, insufficient material)
- FEN/PGN support for state serialization
- Well-tested, actively maintained
- Pure JavaScript, works in Node.js and browser

**Alternatives Considered**:
- `js-chess-engine`: Less mature, fewer features
- Custom implementation: Violates Constitution IV (Library Integration)
- `stockfish.js`: Overkill for rules only (includes AI engine)

### Chessboard UI Library

**Decision**: react-chessboard (v4.x)

**Rationale**:
- Purpose-built React component for chess UI
- Works seamlessly with chess.js
- Supports drag-and-drop, click-to-move
- Customizable square colors, piece themes
- Mobile-responsive
- Active maintenance

**Alternatives Considered**:
- `chessboard.js`: jQuery-based, not React-native
- `@chessground/react`: More complex, steeper learning curve
- Custom SVG board: Unnecessary effort for MVP

### WebSocket Library

**Decision**: socket.io (v4.x)

**Rationale**:
- Automatic reconnection handling (critical for FR-032, FR-033)
- Room-based messaging (natural fit for game rooms)
- Fallback transports for firewall issues
- Established patterns for real-time games
- TypeScript support

**Alternatives Considered**:
- Native WebSocket (`ws`): No built-in reconnection, rooms, or fallbacks
- `Ably`/`Pusher`: External service dependency, cost concerns for indie project
- Server-Sent Events: One-way only, not suitable for game moves

### State Management (Client)

**Decision**: Zustand for local game state

**Rationale**:
- Lightweight (Constitution: avoid heavy global stores for MVP)
- Simple API, minimal boilerplate
- Works well with React 18
- Easy to integrate with socket.io events

**Alternatives Considered**:
- Redux: Too heavy for MVP scope
- React Context alone: Sufficient but Zustand adds devtools, persistence options
- Jotai/Recoil: Similar weight, less ecosystem familiarity

### Monorepo Tooling

**Decision**: Turborepo with pnpm workspaces

**Rationale**:
- Fast builds with caching
- Simple configuration
- pnpm efficient for shared dependencies
- Good Next.js integration

**Alternatives Considered**:
- Nx: More features but higher complexity
- Lerna: Less actively maintained
- Yarn workspaces: Viable but pnpm more efficient

### Timer Implementation

**Decision**: Server-side setInterval with client resync

**Rationale**:
- Server is authoritative (Constitution I)
- Server maintains timer state per game
- Broadcasts time updates every ~100ms or on significant events
- Client interpolates between updates for smooth display
- Grace period triggered server-side only

**Implementation Pattern**:
```
Server:
  - gameTimer = setInterval(tick, 100ms)
  - On tick: decrement time, check expiry, broadcast state
  - On move received: validate, stop timer, switch turn, restart timer

Client:
  - Receives time sync events
  - Local countdown for display smoothness
  - Resyncs on every server event
```

**Alternatives Considered**:
- Client-authoritative timers: Violates Constitution I (cheatable)
- Pure event-based (no interval): Harder to display smooth countdown

### Auto-Move Selection

**Decision**: Filter legal moves, prioritize pawns, random selection

**Rationale**:
- chess.js provides `moves()` with piece filter option
- Filter for pawn moves first: `chess.moves({ piece: 'p' })`
- If empty, use all legal moves: `chess.moves()`
- Random selection: `moves[Math.floor(Math.random() * moves.length)]`
- For promotion: randomly select from ['q', 'r', 'b', 'n']

**Implementation Pattern**:
```typescript
function selectAutoMove(chess: Chess): string {
  const pawnMoves = chess.moves({ piece: 'p' });
  const moves = pawnMoves.length > 0 ? pawnMoves : chess.moves();
  const move = moves[Math.floor(Math.random() * moves.length)];

  // Handle promotion randomization
  if (move.includes('=')) {
    const promotionPieces = ['q', 'r', 'b', 'n'];
    const randomPromotion = promotionPieces[Math.floor(Math.random() * 4)];
    return move.replace(/=[qrbn]/i, `=${randomPromotion}`);
  }
  return move;
}
```

### Game State Persistence

**Decision**: In-memory Map for MVP, Redis-ready interface

**Rationale**:
- MVP simplicity: single server instance, in-memory sufficient
- Design interface that can swap to Redis later
- 5-minute game preservation (FR-034) manageable in memory for 100 games
- ~10KB per game state × 100 games = 1MB (trivial)

**Alternatives Considered**:
- Redis from day 1: Adds deployment complexity for MVP
- Database persistence: Overkill; games are ephemeral
- File-based: Slower, no benefit

### Invite Link Generation

**Decision**: nanoid for game IDs (URL-safe, collision-resistant)

**Rationale**:
- Short, URL-safe strings (e.g., `V1StGXR8_Z5jdHi6B-myT`)
- No external dependencies beyond npm package
- Configurable length for security/usability tradeoff
- 21 characters default provides sufficient entropy

**URL Pattern**: `https://domain.com/game/{gameId}`

## Integration Patterns

### WebSocket Event Flow

```
Game Creation:
  Client → create_game { settings }
  Server → game_created { gameId, inviteLink }

Join Game:
  Client → join_game { gameId }
  Server → game_joined { gameState, playerColor }
  Server → game_start { whitePlayer, blackPlayer } (to both)

Gameplay:
  Client → make_move { gameId, move }
  Server → move_made { move, newState, timers } (to both)
  Server → timer_sync { whiteTime, blackTime, graceActive } (periodic)
  Server → grace_started { player } (when time hits 0)
  Server → auto_move { move, reason } (when grace expires)
  Server → game_over { result, reason }

Actions:
  Client → resign { gameId }
  Client → offer_draw { gameId }
  Client → respond_draw { gameId, accept: boolean }
  Server → draw_offered { from }
  Server → draw_response { accepted }

Reconnection:
  Client → rejoin_game { gameId, sessionId }
  Server → game_state { fullState, timers }
```

### Error Handling

- Invalid move: Server rejects, sends `move_rejected { reason }`
- Disconnection: Socket.io auto-reconnect, server preserves state
- Invalid game ID: `error { code: 'GAME_NOT_FOUND' }`
- Game full: `error { code: 'GAME_FULL' }`
- Already started: `error { code: 'GAME_ALREADY_STARTED' }`

## Open Questions Resolved

All technical decisions made. No NEEDS CLARIFICATION items remain.

## References

- chess.js: https://github.com/jhlywa/chess.js
- react-chessboard: https://github.com/Clariity/react-chessboard
- socket.io: https://socket.io/docs/v4/
- Zustand: https://github.com/pmndrs/zustand
- nanoid: https://github.com/ai/nanoid
- Turborepo: https://turbo.build/repo
