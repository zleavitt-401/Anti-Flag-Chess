import type { Server, Socket } from 'socket.io';
import type { GameStore, StoredGame } from '../services/game-store.js';
import type { SessionStore } from '../services/session-store.js';
import type { TimerState, BoardState, Move, GameResult } from '@anti-flag-chess/core';

/**
 * Manages socket.io room for a single game.
 * Handles joining, leaving, and broadcasting to room members.
 */
export class GameRoom {
  private io: Server;
  private gameId: string;
  private gameStore: GameStore;
  private sessionStore: SessionStore;

  constructor(
    io: Server,
    gameId: string,
    gameStore: GameStore,
    sessionStore: SessionStore
  ) {
    this.io = io;
    this.gameId = gameId;
    this.gameStore = gameStore;
    this.sessionStore = sessionStore;
  }

  /**
   * Gets the room name for this game.
   */
  getRoomName(): string {
    return `game:${this.gameId}`;
  }

  /**
   * Adds a socket to the game room.
   */
  join(socket: Socket): void {
    socket.join(this.getRoomName());
  }

  /**
   * Removes a socket from the game room.
   */
  leave(socket: Socket): void {
    socket.leave(this.getRoomName());
  }

  /**
   * Broadcasts game start to all players.
   */
  broadcastGameStart(boardState: BoardState, timers: TimerState, whiteSessionId: string, blackSessionId: string): void {
    this.io.to(this.getRoomName()).emit('game_start', {
      gameId: this.gameId,
      boardState,
      timers,
      whiteSessionId,
      blackSessionId,
    });
  }

  /**
   * Broadcasts a move to all players.
   */
  broadcastMove(move: Move, boardState: BoardState, timers: TimerState): void {
    this.io.to(this.getRoomName()).emit('move_made', {
      move,
      boardState,
      timers,
    });
  }

  /**
   * Broadcasts timer sync to all players.
   */
  broadcastTimerSync(
    whiteTimeRemaining: number,
    blackTimeRemaining: number,
    activePlayer: 'white' | 'black',
    serverTime: number
  ): void {
    this.io.to(this.getRoomName()).emit('timer_sync', {
      whiteTimeRemaining,
      blackTimeRemaining,
      activePlayer,
      serverTime,
    });
  }

  /**
   * Broadcasts grace period start.
   */
  broadcastGraceStarted(player: 'white' | 'black', graceTimeRemaining: number): void {
    this.io.to(this.getRoomName()).emit('grace_started', {
      player,
      graceTimeRemaining,
    });
  }

  /**
   * Broadcasts auto-move execution.
   */
  broadcastAutoMove(move: Move, boardState: BoardState, timers: TimerState, reason: string): void {
    this.io.to(this.getRoomName()).emit('auto_move', {
      move,
      boardState,
      timers,
      reason,
    });
  }

  /**
   * Broadcasts game over.
   */
  broadcastGameOver(result: GameResult, finalBoardState: BoardState): void {
    this.io.to(this.getRoomName()).emit('game_over', {
      result,
      finalBoardState,
    });
  }

  /**
   * Broadcasts draw offer to opponent.
   */
  broadcastDrawOffered(toSocket: Socket, from: 'white' | 'black'): void {
    toSocket.emit('draw_offered', { from });
  }

  /**
   * Broadcasts draw declined to offerer.
   */
  broadcastDrawDeclined(toSocket: Socket): void {
    toSocket.emit('draw_declined', {});
  }

  /**
   * Broadcasts opponent disconnected.
   */
  broadcastOpponentDisconnected(toSocket: Socket, playerColor: 'white' | 'black'): void {
    toSocket.emit('opponent_disconnected', { playerColor });
  }

  /**
   * Broadcasts opponent reconnected.
   */
  broadcastOpponentReconnected(toSocket: Socket, playerColor: 'white' | 'black'): void {
    toSocket.emit('opponent_reconnected', { playerColor });
  }
}
