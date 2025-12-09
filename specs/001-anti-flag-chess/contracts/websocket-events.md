# WebSocket Events Contract

**Feature**: 001-anti-flag-chess
**Protocol**: socket.io v4
**Date**: 2025-12-09

## Connection

### Client Connection
```typescript
// Client connects with session ID for reconnection support
socket.connect({
  auth: {
    sessionId: string;  // Persisted in localStorage
  }
});
```

### Server Events on Connect
```typescript
// Emitted if client was in an active game
socket.emit('active_game_found', {
  gameId: string;
  gameState: GameStatePayload;
});
```

---

## Game Lifecycle Events

### Create Game

**Client → Server**: `create_game`
```typescript
{
  settings: {
    turnTimeSeconds: number;      // 10-300
    gracePeriodSeconds: number;   // 0-5
    timeoutBehavior: 'auto_move' | 'lose_on_time';
    hostColor: 'white' | 'black';
  }
}
```

**Server → Client**: `game_created`
```typescript
{
  gameId: string;
  inviteLink: string;             // Full URL to share
  settings: GameSettings;
  hostColor: 'white' | 'black';
}
```

**Server → Client**: `error`
```typescript
{
  code: 'INVALID_SETTINGS';
  message: string;
}
```

---

### Join Game

**Client → Server**: `join_game`
```typescript
{
  gameId: string;
}
```

**Server → Joiner**: `game_joined`
```typescript
{
  gameId: string;
  playerColor: 'white' | 'black';
  opponentConnected: boolean;
  settings: GameSettings;
}
```

**Server → Both Players**: `game_start`
```typescript
{
  gameId: string;
  boardState: BoardStatePayload;
  timers: TimerStatePayload;
  whiteSessionId: string;         // For display purposes
  blackSessionId: string;
}
```

**Server → Client**: `error`
```typescript
{
  code: 'GAME_NOT_FOUND' | 'GAME_FULL' | 'GAME_ALREADY_STARTED';
  message: string;
}
```

---

### Rejoin Game (Reconnection)

**Client → Server**: `rejoin_game`
```typescript
{
  gameId: string;
  sessionId: string;
}
```

**Server → Client**: `game_state`
```typescript
{
  gameId: string;
  boardState: BoardStatePayload;
  timers: TimerStatePayload;
  moves: MovePayload[];
  playerColor: 'white' | 'black';
  opponentConnected: boolean;
  pendingDrawOffer: DrawOfferPayload | null;
}
```

**Server → Opponent**: `opponent_reconnected`
```typescript
{
  playerColor: 'white' | 'black';
}
```

---

## Gameplay Events

### Make Move

**Client → Server**: `make_move`
```typescript
{
  gameId: string;
  move: string;                   // SAN notation (e.g., "e4", "Nxf3", "e8=Q")
}
```

**Server → Both Players**: `move_made`
```typescript
{
  move: MovePayload;
  boardState: BoardStatePayload;
  timers: TimerStatePayload;
}
```

**Server → Client**: `move_rejected`
```typescript
{
  reason: 'INVALID_MOVE' | 'NOT_YOUR_TURN' | 'GAME_NOT_ACTIVE';
  message: string;
}
```

---

### Timer Events

**Server → Both Players**: `timer_sync` (every 100ms during active game)
```typescript
{
  whiteTimeRemaining: number;     // Milliseconds
  blackTimeRemaining: number;
  activePlayer: 'white' | 'black';
  serverTime: number;             // Server timestamp for drift correction
}
```

**Server → Both Players**: `grace_started`
```typescript
{
  player: 'white' | 'black';
  graceTimeRemaining: number;     // Milliseconds
}
```

**Server → Both Players**: `auto_move`
```typescript
{
  move: MovePayload;
  boardState: BoardStatePayload;
  timers: TimerStatePayload;
  reason: 'grace_expired';
}
```

---

### Game End Events

**Server → Both Players**: `game_over`
```typescript
{
  result: {
    winner: 'white' | 'black' | 'draw';
    reason: 'checkmate' | 'stalemate' | 'resignation' | 'agreed_draw'
          | 'time_loss' | 'threefold_repetition' | 'fifty_move_rule'
          | 'insufficient_material';
  };
  finalBoardState: BoardStatePayload;
}
```

---

## Player Actions

### Resign

**Client → Server**: `resign`
```typescript
{
  gameId: string;
}
```

**Server → Both Players**: `game_over`
```typescript
{
  result: {
    winner: 'white' | 'black';    // Opponent of resigning player
    reason: 'resignation';
  };
  finalBoardState: BoardStatePayload;
}
```

---

### Draw Offer

**Client → Server**: `offer_draw`
```typescript
{
  gameId: string;
}
```

**Server → Opponent**: `draw_offered`
```typescript
{
  from: 'white' | 'black';
}
```

**Client → Server**: `respond_draw`
```typescript
{
  gameId: string;
  accept: boolean;
}
```

**Server → Offerer**: `draw_declined`
```typescript
{}
```

**Server → Both Players**: `game_over` (if accepted)
```typescript
{
  result: {
    winner: 'draw';
    reason: 'agreed_draw';
  };
  finalBoardState: BoardStatePayload;
}
```

---

## Disconnection Events

**Server → Opponent**: `opponent_disconnected`
```typescript
{
  playerColor: 'white' | 'black';
}
```

**Server → Opponent**: `opponent_reconnected`
```typescript
{
  playerColor: 'white' | 'black';
}
```

---

## Payload Types

```typescript
interface GameSettings {
  turnTimeSeconds: number;
  gracePeriodSeconds: number;
  timeoutBehavior: 'auto_move' | 'lose_on_time';
  hostColor: 'white' | 'black';
}

interface BoardStatePayload {
  fen: string;
  turn: 'white' | 'black';
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  drawReason: string | null;
  legalMoves: string[];
}

interface TimerStatePayload {
  whiteTimeRemaining: number;
  blackTimeRemaining: number;
  activePlayer: 'white' | 'black' | null;
  isGracePeriod: boolean;
  graceTimeRemaining: number;
}

interface MovePayload {
  san: string;
  from: string;
  to: string;
  piece: string;
  captured: string | null;
  promotion: string | null;
  isAutoMove: boolean;
  timestamp: number;
  color: 'white' | 'black';
}

interface DrawOfferPayload {
  from: 'white' | 'black';
  offeredAt: number;
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_SETTINGS` | Game settings validation failed |
| `GAME_NOT_FOUND` | No game with specified ID exists |
| `GAME_FULL` | Game already has two players |
| `GAME_ALREADY_STARTED` | Cannot join a game in progress |
| `INVALID_MOVE` | Move is not legal in current position |
| `NOT_YOUR_TURN` | Player attempted move out of turn |
| `GAME_NOT_ACTIVE` | Action attempted on non-active game |
| `SESSION_MISMATCH` | Session ID doesn't match game player |
