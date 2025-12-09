'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getSessionId } from '@/lib/session';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: Error | null;
}

/**
 * Hook for managing socket.io connection with session ID authentication.
 */
export function useSocket(): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const sessionId = getSessionId();

    const socket = io(WS_URL, {
      auth: {
        sessionId,
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError(err);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    error,
  };
}

/**
 * Hook for socket event listeners with automatic cleanup.
 */
export function useSocketEvent<T>(
  socket: Socket | null,
  event: string,
  callback: (data: T) => void
): void {
  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, event, callback]);
}

/**
 * Hook for emitting socket events with response handling.
 */
export function useSocketEmit(socket: Socket | null) {
  const emit = useCallback(
    <T>(event: string, data?: unknown): Promise<T> => {
      return new Promise((resolve, reject) => {
        if (!socket || !socket.connected) {
          reject(new Error('Socket not connected'));
          return;
        }

        socket.emit(event, data, (response: T) => {
          resolve(response);
        });
      });
    },
    [socket]
  );

  return { emit };
}
