'use client';

import { useState, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import type { BoardState } from '@anti-flag-chess/core';
import type { Square } from 'react-chessboard/dist/chessboard/types';

interface ChessBoardProps {
  boardState: BoardState;
  playerColor: 'white' | 'black';
  onMove: (move: string) => void;
  disabled?: boolean;
  lastMove?: { from: string; to: string } | null;
  isAutoMove?: boolean;
}

export function ChessBoard({
  boardState,
  playerColor,
  onMove,
  disabled = false,
  lastMove,
  isAutoMove = false,
}: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Calculate legal moves from selected square
  const legalMovesFromSquare = useMemo(() => {
    if (!selectedSquare) return [];

    // Filter legal moves that start from selected square
    return boardState.legalMoves.filter((move) => {
      // SAN notation parsing - simplified
      // Pawn moves start with lowercase letter (file) or just destination
      // Piece moves start with uppercase letter
      const fromSquare = selectedSquare.toLowerCase();

      // This is a simplified check - for a proper implementation,
      // we'd need to parse SAN or use verbose moves from chess.js
      return move.includes(fromSquare) || move.toLowerCase().startsWith(fromSquare[0]);
    });
  }, [selectedSquare, boardState.legalMoves]);

  // Custom square styles
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      };
    }

    // Highlight check
    if (boardState.isCheck) {
      // Find the king's square - we need to parse FEN for this
      const fen = boardState.fen;
      const kingChar = boardState.turn === 'white' ? 'K' : 'k';
      const rows = fen.split(' ')[0].split('/');

      for (let row = 0; row < 8; row++) {
        let col = 0;
        for (const char of rows[row]) {
          if (char >= '1' && char <= '8') {
            col += parseInt(char);
          } else {
            if (char === kingChar) {
              const square = `${String.fromCharCode(97 + col)}${8 - row}`;
              styles[square] = {
                ...styles[square],
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
              };
            }
            col++;
          }
        }
      }
    }

    // Highlight last move
    if (lastMove) {
      const lastMoveColor = isAutoMove ? 'rgba(255, 165, 0, 0.5)' : 'rgba(0, 255, 0, 0.3)';
      styles[lastMove.from] = {
        ...styles[lastMove.from],
        backgroundColor: lastMoveColor,
      };
      styles[lastMove.to] = {
        ...styles[lastMove.to],
        backgroundColor: lastMoveColor,
      };
    }

    return styles;
  }, [selectedSquare, boardState.isCheck, boardState.fen, boardState.turn, lastMove, isAutoMove]);

  // Handle square click
  const handleSquareClick = useCallback(
    (square: Square) => {
      if (disabled || boardState.turn !== playerColor) {
        return;
      }

      if (selectedSquare) {
        // Try to make a move
        const moveAttempt = `${selectedSquare}${square}`;

        // Check if this might be a promotion
        const isPawnPromotion =
          selectedSquare[1] === (playerColor === 'white' ? '7' : '2') &&
          square[1] === (playerColor === 'white' ? '8' : '1');

        // Find matching legal move
        const matchingMove = boardState.legalMoves.find((m) => {
          // Simple matching - works for most moves
          return m.includes(square) || m === moveAttempt;
        });

        if (matchingMove) {
          if (isPawnPromotion) {
            // Default to queen for now - can add promotion picker later
            onMove(matchingMove.includes('=') ? matchingMove : `${matchingMove}=Q`);
          } else {
            onMove(matchingMove);
          }
        }

        setSelectedSquare(null);
      } else {
        setSelectedSquare(square);
      }
    },
    [selectedSquare, disabled, boardState.turn, boardState.legalMoves, playerColor, onMove]
  );

  // Handle drag-and-drop
  const handleDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square): boolean => {
      if (disabled || boardState.turn !== playerColor) {
        return false;
      }

      // Find matching legal move
      const isPawnPromotion =
        sourceSquare[1] === (playerColor === 'white' ? '7' : '2') &&
        targetSquare[1] === (playerColor === 'white' ? '8' : '1');

      const matchingMove = boardState.legalMoves.find((m) => {
        return m.includes(sourceSquare) && m.includes(targetSquare);
      });

      if (matchingMove) {
        if (isPawnPromotion) {
          onMove(matchingMove.includes('=') ? matchingMove : `${matchingMove}=Q`);
        } else {
          onMove(matchingMove);
        }
        setSelectedSquare(null);
        return true;
      }

      return false;
    },
    [disabled, boardState.turn, boardState.legalMoves, playerColor, onMove]
  );

  return (
    <div className="w-full max-w-[500px] mx-auto">
      <Chessboard
        position={boardState.fen}
        onSquareClick={handleSquareClick}
        onPieceDrop={handleDrop}
        boardOrientation={playerColor}
        customSquareStyles={customSquareStyles}
        arePiecesDraggable={!disabled && boardState.turn === playerColor}
      />
    </div>
  );
}
