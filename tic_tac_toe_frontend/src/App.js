import React, { useState } from 'react';
import './App.css';

// GAME LOGIC HELPERS

/**
 * Checks if a player has won.
 * @param {Array<string>} squares - current board state.
 * @returns {'X' | 'O' | null} The winner symbol or null.
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];
  for (let [a,b,c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// SQUARE COMPONENT

/**
 * Renders a single tic tac toe square.
 * @param {object} props 
 */
function Square({ value, onClick, isWinning }) {
  return (
    <button
      className={`ttt-square${isWinning ? " ttt-square--winner" : ""}`}
      onClick={onClick}
      aria-label={value ? `Cell with ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}

// BOARD COMPONENT

/**
 * Renders the 3x3 board.
 * @param {object} props 
 */
function Board({ squares, onSquareClick, winningLine }) {
  function renderSquare(idx) {
    return (
      <Square
        key={idx}
        value={squares[idx]}
        isWinning={winningLine?.includes(idx)}
        onClick={() => onSquareClick(idx)}
      />
    );
  }

  return (
    <div className="ttt-board">
      {[0,1,2].map(r => (
        <div className="ttt-row" key={r}>
          {[0,1,2].map(c => renderSquare(r*3 + c))}
        </div>
      ))}
    </div>
  );
}

// GET WINNING LINE
function getWinningLine(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return null;
}

// PUBLIC_INTERFACE
/**
 * Main App component for Tic Tac Toe.
 */
function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Winner detection & draw logic
  const winner = calculateWinner(squares);
  const winningLine = getWinningLine(squares);
  const isDraw = !winner && squares.every(Boolean);

  // PUBLIC_INTERFACE
  /**
   * Resets the game state for a new game.
   */
  function restartGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // PUBLIC_INTERFACE
  /**
   * Handles a square click event.
   */
  function handleSquareClick(idx) {
    if (squares[idx] || winner) return;

    const next = squares.slice();
    next[idx] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  let statusMsg;
  if (winner) {
    statusMsg = (
      <span>
        <span className="ttt-winner-text">{winner}</span> wins!
      </span>
    );
  } else if (isDraw) {
    statusMsg = <span className="ttt-draw-text">It's a draw!</span>;
  } else {
    statusMsg = (
      <span>
        <span className="ttt-player-text">{xIsNext ? "X" : "O"}</span>'s turn
      </span>
    );
  }

  return (
    <div className="ttt-app-bg">
      <div className="ttt-container">
        <div className="ttt-status">{statusMsg}</div>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        <div className="ttt-controls">
          <button className="ttt-restart-btn" onClick={restartGame}>
            Restart
          </button>
        </div>
        <footer className="ttt-footer" aria-hidden="true">
          <span>Tic Tac Toe &middot; Two Player &middot; React</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
