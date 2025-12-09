import type { Server, Socket } from 'socket.io';
import type { GameStore } from '../services/game-store.js';
import type { SessionStore } from '../services/session-store.js';
import type { TimerService } from '../services/timer-service.js';
import { handleCreateGame } from './create-game.js';
import { handleJoinGame } from './join-game.js';
import { handleMakeMove } from './make-move.js';
import { handleResign } from './resign.js';
import { handleDrawOffer } from './draw-offer.js';
import { handleDrawResponse } from './draw-response.js';
import { handleRejoinGame } from './rejoin-game.js';

/**
 * Registers all WebSocket event handlers.
 */
export function registerHandlers(
  io: Server,
  gameStore: GameStore,
  sessionStore: SessionStore,
  timerService: TimerService
): void {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Extract session ID from auth
    const sessionId = socket.handshake.auth?.sessionId as string | undefined;
    if (sessionId) {
      sessionStore.setSocketSession(socket.id, sessionId);

      // Check for active game
      const gameId = sessionStore.getGameForSession(sessionId);
      if (gameId) {
        const game = gameStore.getGame(gameId);
        if (game && game.status !== 'ended') {
          socket.emit('active_game_found', {
            gameId,
            gameState: {
              boardState: game.gameState.getBoardState(),
              moves: game.moves,
              settings: game.settings,
              status: game.status,
            },
          });
        }
      }
    }

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      const sid = sessionStore.getSessionForSocket(socket.id);
      if (sid) {
        const gameId = sessionStore.getGameForSession(sid);
        if (gameId) {
          const game = gameStore.getGame(gameId);
          if (game) {
            // Update player connection status
            gameStore.updatePlayer(gameId, sid, {
              isConnected: false,
              socketId: null,
            });

            // Notify opponent
            for (const color of ['white', 'black'] as const) {
              const player = game.players[color];
              if (player && player.sessionId !== sid && player.socketId) {
                io.to(player.socketId).emit('opponent_disconnected', {
                  playerColor: color === 'white' ? 'black' : 'white',
                });
              }
            }
          }
        }
      }
      sessionStore.removeSocket(socket.id);
    });

    // Create game handler
    socket.on('create_game', (payload, callback) => {
      handleCreateGame(io, socket, gameStore, sessionStore, payload, callback);
    });

    // Join game handler
    socket.on('join_game', (payload, callback) => {
      handleJoinGame(io, socket, gameStore, sessionStore, timerService, payload, callback);
    });

    // Make move handler
    socket.on('make_move', (payload, callback) => {
      handleMakeMove(io, socket, gameStore, sessionStore, timerService, payload, callback);
    });

    // Resign handler
    socket.on('resign', (payload, callback) => {
      handleResign(io, socket, gameStore, sessionStore, timerService, payload, callback);
    });

    // Draw offer handler
    socket.on('offer_draw', (payload, callback) => {
      handleDrawOffer(io, socket, gameStore, sessionStore, payload, callback);
    });

    // Draw response handler
    socket.on('respond_draw', (payload, callback) => {
      handleDrawResponse(io, socket, gameStore, sessionStore, timerService, payload, callback);
    });

    // Rejoin game handler
    socket.on('rejoin_game', (payload, callback) => {
      handleRejoinGame(io, socket, gameStore, sessionStore, timerService, payload, callback);
    });
  });
}
