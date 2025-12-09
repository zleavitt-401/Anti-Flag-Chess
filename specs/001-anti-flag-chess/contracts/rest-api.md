# REST API Contract

**Feature**: 001-anti-flag-chess
**Date**: 2025-12-09

## Overview

REST endpoints are minimal for MVP. Primary game interactions use WebSocket.
REST is used for:
- Initial page loads (SSR data)
- Game metadata for invite links (Open Graph)

---

## Endpoints

### GET /api/game/:gameId

Fetch game metadata for displaying invite page or reconnecting.

**Request**
```
GET /api/game/V1StGXR8_Z5jdHi6B-myT
```

**Response 200 OK**
```json
{
  "id": "V1StGXR8_Z5jdHi6B-myT",
  "status": "waiting",
  "settings": {
    "turnTimeSeconds": 60,
    "gracePeriodSeconds": 2,
    "timeoutBehavior": "auto_move",
    "hostColor": "white"
  },
  "createdAt": 1702123456789,
  "hostConnected": true
}
```

**Response 200 OK (active game)**
```json
{
  "id": "V1StGXR8_Z5jdHi6B-myT",
  "status": "active",
  "settings": {
    "turnTimeSeconds": 60,
    "gracePeriodSeconds": 2,
    "timeoutBehavior": "auto_move",
    "hostColor": "white"
  },
  "createdAt": 1702123456789,
  "startedAt": 1702123500000,
  "moveCount": 12,
  "currentTurn": "black"
}
```

**Response 200 OK (ended game)**
```json
{
  "id": "V1StGXR8_Z5jdHi6B-myT",
  "status": "ended",
  "settings": {
    "turnTimeSeconds": 60,
    "gracePeriodSeconds": 2,
    "timeoutBehavior": "auto_move",
    "hostColor": "white"
  },
  "createdAt": 1702123456789,
  "startedAt": 1702123500000,
  "endedAt": 1702124000000,
  "result": {
    "winner": "white",
    "reason": "checkmate"
  },
  "moveCount": 47
}
```

**Response 404 Not Found**
```json
{
  "error": {
    "code": "GAME_NOT_FOUND",
    "message": "No game found with ID V1StGXR8_Z5jdHi6B-myT"
  }
}
```

---

### GET /api/health

Health check endpoint for monitoring.

**Request**
```
GET /api/health
```

**Response 200 OK**
```json
{
  "status": "ok",
  "timestamp": 1702123456789,
  "activeGames": 42,
  "connectedPlayers": 78
}
```

---

## Response Types

```typescript
interface GameMetadata {
  id: string;
  status: 'waiting' | 'active' | 'ended';
  settings: {
    turnTimeSeconds: number;
    gracePeriodSeconds: number;
    timeoutBehavior: 'auto_move' | 'lose_on_time';
    hostColor: 'white' | 'black';
  };
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  result?: {
    winner: 'white' | 'black' | 'draw';
    reason: string;
  };
  moveCount?: number;
  currentTurn?: 'white' | 'black';
  hostConnected?: boolean;
}

interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: number;
  activeGames: number;
  connectedPlayers: number;
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `GAME_NOT_FOUND` | 404 | No game exists with the specified ID |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Notes

- All timestamps are Unix milliseconds
- No authentication required for MVP (session-based play)
- CORS configured for same-origin only in production
- Rate limiting: 100 requests/minute per IP (basic DoS protection)
