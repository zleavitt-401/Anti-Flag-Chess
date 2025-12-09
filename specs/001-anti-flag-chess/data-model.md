# Data Model: Anti-Flag Timed Chess

**Feature**: 001-anti-flag-chess
**Date**: 2025-12-09

## Entity Definitions

### Game

Represents a chess match instance from creation to completion.

```typescript
interface Game {
  id: string;                    // nanoid, unique identifier
  settings: GameSettings;        // Timing configuration
  status: GameStatus;            // Current lifecycle state
  board: BoardState;             // Current chess position
  moves: Move[];                 // Move history
  players: {
    white: PlayerSession | null; // Host or joiner based on host's choice
    black: PlayerSession | null;
  };
  result: GameResult | null;     // Populated when game ends
  createdAt: number;             // Unix timestamp ms
  startedAt: number | null;      // When both players joined
  endedAt: number | null;        // When game concluded
}

type GameStatus =
  | 'waiting'    // Created, waiting for opponent
  | 'active'     // Both players present, game in progress
  | 'ended';     // Game concluded

interface GameResult {
  winner: 'white' | 'black' | 'draw';
  reason: GameEndReason;
}

type GameEndReason =
  | 'checkmate'
  | 'stalemate'
  | 'resignation'
  | 'agreed_draw'
  | 'time_loss'
  | 'threefold_repetition'
  | 'fifty_move_rule'
  | 'insufficient_material';
```

**Validation Rules**:
- `id` must be unique across all games
- `status` transitions: `waiting` → `active` → `ended`
- `players.white` and `players.black` both non-null required for `active` status
- `result` must be null unless `status` is `ended`
- `startedAt` must be set when transitioning to `active`
- `endedAt` must be set when transitioning to `ended`

---

### GameSettings

Configuration for timing rules, set at game creation.

```typescript
interface GameSettings {
  turnTimeSeconds: number;       // 10-300 (10s to 5min)
  gracePeriodSeconds: number;    // 0-5
  timeoutBehavior: TimeoutBehavior;
  hostColor: 'white' | 'black';  // Host's chosen color
}

type TimeoutBehavior = 'auto_move' | 'lose_on_time';
```

**Validation Rules**:
- `turnTimeSeconds`: min 10, max 300, integer
- `gracePeriodSeconds`: min 0, max 5, integer
- `timeoutBehavior`: exactly one of allowed values
- `hostColor`: exactly 'white' or 'black'

**Defaults**:
- `turnTimeSeconds`: 60
- `gracePeriodSeconds`: 2
- `timeoutBehavior`: 'auto_move'
- `hostColor`: 'white'

---

### PlayerSession

Represents a player's connection to a game.

```typescript
interface PlayerSession {
  sessionId: string;             // Unique per browser session
  socketId: string | null;       // Current socket.io connection ID
  color: 'white' | 'black';      // Assigned color
  isConnected: boolean;          // Current connection status
  lastActivityAt: number;        // Unix timestamp ms
}
```

**Validation Rules**:
- `sessionId` generated client-side, persisted in localStorage
- `socketId` null when disconnected, updated on (re)connection
- `color` immutable after assignment
- `lastActivityAt` updated on any player action or heartbeat

---

### BoardState

Current chess position, derived from chess.js.

```typescript
interface BoardState {
  fen: string;                   // FEN notation for position
  turn: 'white' | 'black';       // Whose turn
  isCheck: boolean;              // King in check
  isCheckmate: boolean;          // Game over by checkmate
  isStalemate: boolean;          // Game over by stalemate
  isDraw: boolean;               // Game over by draw rule
  drawReason: DrawReason | null; // If isDraw, why
  legalMoves: string[];          // Current legal moves in SAN
}

type DrawReason =
  | 'threefold_repetition'
  | 'fifty_move_rule'
  | 'insufficient_material';
```

**Notes**:
- FEN includes castling rights, en passant, halfmove clock, fullmove number
- `legalMoves` refreshed after each move for UI highlighting
- chess.js is source of truth; BoardState is serialized view

---

### Move

A single chess move in the game history.

```typescript
interface Move {
  san: string;                   // Standard Algebraic Notation (e.g., "e4", "Nxf3+")
  from: string;                  // Source square (e.g., "e2")
  to: string;                    // Target square (e.g., "e4")
  piece: PieceType;              // Piece that moved
  captured: PieceType | null;    // Piece captured, if any
  promotion: PromotionPiece | null; // Promotion piece, if pawn promoted
  isAutoMove: boolean;           // True if system-generated
  timestamp: number;             // Unix timestamp ms when move was made
  color: 'white' | 'black';      // Who made the move
}

type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
type PromotionPiece = 'q' | 'r' | 'b' | 'n';
```

**Validation Rules**:
- `san` must be valid chess notation
- `from` and `to` must be valid squares (a1-h8)
- `promotion` only valid when pawn reaches 8th rank
- `isAutoMove` true only when grace period expired

---

### TimerState

Real-time timing information managed server-side.

```typescript
interface TimerState {
  whiteTimeRemaining: number;    // Milliseconds remaining for white's current turn
  blackTimeRemaining: number;    // Milliseconds remaining for black's current turn
  activePlayer: 'white' | 'black' | null; // Whose timer is running
  isGracePeriod: boolean;        // True if in grace period
  graceTimeRemaining: number;    // Milliseconds remaining in grace (0 if not in grace)
  lastSyncAt: number;            // Server timestamp of last sync
}
```

**State Transitions**:

```
Turn Start:
  - activePlayer = current turn color
  - timeRemaining = settings.turnTimeSeconds * 1000
  - isGracePeriod = false

Time Expires:
  - isGracePeriod = true (if gracePeriodSeconds > 0)
  - graceTimeRemaining = settings.gracePeriodSeconds * 1000

Grace Expires:
  - If auto_move: execute auto-move, switch turn
  - If lose_on_time: end game

Move Made:
  - Stop current timer
  - Switch activePlayer
  - Reset timer for new active player
```

---

### DrawOffer

Tracks pending draw offers between players.

```typescript
interface DrawOffer {
  from: 'white' | 'black';       // Who offered
  offeredAt: number;             // Unix timestamp ms
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}
```

**Rules**:
- Only one pending offer at a time
- Offer expires if offerer makes a move before response
- Declined offers allow re-offering after next move

---

## State Diagram: Game Lifecycle

```
                    ┌─────────────┐
                    │   waiting   │
                    │ (host only) │
                    └──────┬──────┘
                           │ opponent joins
                           ▼
                    ┌─────────────┐
              ┌────►│   active    │◄────┐
              │     │  (playing)  │     │
              │     └──────┬──────┘     │
              │            │            │
         move made    end condition   timeout
              │            │            │
              │            ▼            │
              │     ┌─────────────┐     │
              └─────│    ended    │─────┘
                    │  (result)   │
                    └─────────────┘
```

## Indexes / Lookups (In-Memory)

```typescript
// Primary game storage
const games: Map<string, Game> = new Map();

// Session to game mapping (for reconnection)
const sessionToGame: Map<string, string> = new Map(); // sessionId → gameId

// Active socket to session mapping
const socketToSession: Map<string, string> = new Map(); // socketId → sessionId
```

## Data Volume Estimates (MVP)

| Entity | Max Count | Size Each | Total |
|--------|-----------|-----------|-------|
| Active Games | 100 | ~10KB | 1MB |
| Sessions | 200 | ~200B | 40KB |
| Moves per game | ~200 avg | ~100B | 20KB/game |

Total in-memory: ~3MB for 100 concurrent games. Trivial for MVP.
