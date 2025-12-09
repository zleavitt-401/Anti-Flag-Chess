import { create } from 'zustand';
import type { BoardState, GameSettings, Move, TimerState, GameResult } from '@anti-flag-chess/core';

export type GameViewStatus =
  | 'idle'
  | 'creating'
  | 'waiting'
  | 'joining'
  | 'active'
  | 'ended'
  | 'error';

export interface GameStoreState {
  // Connection
  isConnected: boolean;

  // Game state
  gameId: string | null;
  status: GameViewStatus;
  settings: GameSettings | null;
  playerColor: 'white' | 'black' | null;
  opponentConnected: boolean;

  // Board state
  boardState: BoardState | null;
  moves: Move[];
  lastMove: { from: string; to: string } | null;
  isLastMoveAuto: boolean;

  // Timer state
  timerState: TimerState | null;

  // Game result
  result: GameResult | null;

  // UI state
  error: string | null;
  inviteLink: string | null;
  autoMoveNotification: { player: 'white' | 'black' } | null;

  // Draw offer state
  pendingDrawOffer: { from: 'white' | 'black' } | null;

  // Actions
  setConnected: (connected: boolean) => void;
  setGameId: (id: string | null) => void;
  setStatus: (status: GameViewStatus) => void;
  setSettings: (settings: GameSettings | null) => void;
  setPlayerColor: (color: 'white' | 'black' | null) => void;
  setOpponentConnected: (connected: boolean) => void;
  setBoardState: (state: BoardState | null) => void;
  addMove: (move: Move, isAuto?: boolean) => void;
  setMoves: (moves: Move[]) => void;
  setLastMove: (move: { from: string; to: string } | null, isAuto?: boolean) => void;
  setTimerState: (state: TimerState | null | ((prev: TimerState | null) => TimerState | null)) => void;
  setResult: (result: GameResult | null) => void;
  setError: (error: string | null) => void;
  setInviteLink: (link: string | null) => void;
  setAutoMoveNotification: (notification: { player: 'white' | 'black' } | null) => void;
  setPendingDrawOffer: (offer: { from: 'white' | 'black' } | null) => void;
  reset: () => void;
}

const initialState = {
  isConnected: false,
  gameId: null,
  status: 'idle' as GameViewStatus,
  settings: null,
  playerColor: null,
  opponentConnected: false,
  boardState: null,
  moves: [],
  lastMove: null,
  isLastMoveAuto: false,
  timerState: null,
  result: null,
  error: null,
  inviteLink: null,
  autoMoveNotification: null,
  pendingDrawOffer: null,
};

export const useGameStore = create<GameStoreState>((set) => ({
  ...initialState,

  setConnected: (connected) => set({ isConnected: connected }),
  setGameId: (id) => set({ gameId: id }),
  setStatus: (status) => set({ status }),
  setSettings: (settings) => set({ settings }),
  setPlayerColor: (color) => set({ playerColor: color }),
  setOpponentConnected: (connected) => set({ opponentConnected: connected }),
  setBoardState: (state) => set({ boardState: state }),
  addMove: (move, isAuto = false) =>
    set((s) => ({
      moves: [...s.moves, move],
      lastMove: { from: move.from, to: move.to },
      isLastMoveAuto: isAuto,
    })),
  setMoves: (moves) => set({ moves }),
  setLastMove: (move, isAuto = false) => set({ lastMove: move, isLastMoveAuto: isAuto }),
  setTimerState: (state) =>
    set((s) => ({
      timerState: typeof state === 'function' ? state(s.timerState) : state,
    })),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setInviteLink: (link) => set({ inviteLink: link }),
  setAutoMoveNotification: (notification) => set({ autoMoveNotification: notification }),
  setPendingDrawOffer: (offer) => set({ pendingDrawOffer: offer }),
  reset: () => set(initialState),
}));
