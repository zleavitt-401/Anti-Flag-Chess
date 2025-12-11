import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerHandlers } from './handlers/index.js';
import { GameStore } from './services/game-store.js';
import { SessionStore } from './services/session-store.js';
import { TimerService } from './services/timer-service.js';
import { selectAutoMove } from '@anti-flag-chess/core';
import { GameRoom } from './rooms/game-room.js';
import { checkGameEnd, createTimeLossResult } from './services/game-end-detector.js';

const PORT = process.env.PORT || 3001;

// Create Express app and HTTP server
const app = express();
const httpServer = createServer(app);

// Create Socket.IO server with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Create stores
const gameStore = new GameStore();
const sessionStore = new SessionStore();

// Create timer service with grace expiry handler
const timerService = new TimerService(io, gameStore, (gameId, player) => {
  // Handle grace period expiry (auto-move or lose on time)
  const game = gameStore.getGame(gameId);
  if (!game) {
    console.log(`Grace expired handler: Game ${gameId} not found`);
    return;
  }
  if (game.status !== 'active') {
    console.log(`Grace expired handler: Game ${gameId} not active (status=${game.status})`);
    return;
  }

  console.log(`Grace expired handler: Processing for ${player} in game ${gameId}, behavior=${game.settings.timeoutBehavior}`);

  const room = new GameRoom(io, gameId, gameStore, sessionStore);

  if (game.settings.timeoutBehavior === 'auto_move') {
    // Execute auto-move
    const autoMove = selectAutoMove(game.gameState);
    console.log(`Grace expired handler: Auto-move selected: ${autoMove}`);
    if (autoMove) {
      const moveResult = game.gameState.makeMove(autoMove, true);
      console.log(`Grace expired handler: Move result: ${moveResult ? moveResult.san : 'null'}`);
      if (moveResult) {
        game.moves.push(moveResult);
        timerService.onMoveMade(gameId);

        const boardState = game.gameState.getBoardState();
        const timerState = timerService.getTimerState(gameId);

        console.log(`Grace expired handler: Broadcasting auto-move ${moveResult.san}, turn is now ${boardState.turn}`);
        room.broadcastAutoMove(moveResult, boardState, timerState!, 'grace_expired');

        // Check for game end
        const endCheck = checkGameEnd(boardState, boardState.turn);
        if (endCheck.isEnded && endCheck.result) {
          console.log(`Grace expired handler: Game ended - ${endCheck.result.reason}`);
          timerService.stopGame(gameId);
          gameStore.endGame(gameId, endCheck.result);
          room.broadcastGameOver(endCheck.result, boardState);
        }
      }
    } else {
      console.log(`Grace expired handler: No auto-move available!`);
    }
  } else {
    // Lose on time
    const result = createTimeLossResult(player);
    timerService.stopGame(gameId);
    gameStore.endGame(gameId, result);
    room.broadcastGameOver(result, game.gameState.getBoardState());
  }
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Register WebSocket handlers
registerHandlers(io, gameStore, sessionStore, timerService);

// Start server
httpServer.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { io, gameStore, sessionStore };
