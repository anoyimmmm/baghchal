import React, { useState } from "react";
import Piece from "./Piece";
import ValidateMove from "./utilities/MoveValidation.js";

const Board = ({ board, onMoveSend }) => {
  const boardSize = 4;
  const cellSize = 180;
  const pieceRadius = 40;
  const padding = pieceRadius + 1;
  const svgSize = padding * 2 + boardSize * cellSize;

  const [boardState, setboardState] = useState({
    // board: {
    //   // tigers at four corners
    //   "0-0": "tiger",
    //   "0-4": "tiger",
    //   "4-0": "tiger",
    //   "4-4": "tiger",
    //   // goats for demo only
    //   "1-1": "goat",
    //   "1-3": "goat",
    //   "3-1": "goat",
    // },
    // board: board,
    selectedPiece: null,
    activePiece: null, // this is the non-null piece clicked before clicking a null piece
    unusedGoat: 24,
    deadGoatCount: 0,
    // highlightedPieces: [],
    currentPlayer: "tiger", // 'goat' or 'tiger'
    phase: "placement", // either placement or displacement
  });

  // add useEffect here to update state variables when

  const handlePieceClick = (row, col, pieceType) => {
    const pieceKey = `${row}-${col}`;
    handleSelection(row, col, pieceType);

    // check if the move is valid
    const fromKey = boardState.activePiece;
    const toKey = pieceKey;
    const moveType =
      ValidateMove(fromKey, toKey, board[boardState.activePiece], board) ||
      (boardState.phase == "placement" &&
      !board[pieceKey] &&
      boardState.currentPlayer == "goat"
        ? "place"
        : "");
    // const moveType = function () {
    //   if (
    //     boardState.phase == "placement" &&
    //     !board[boardState.selectedPiece]
    //   ) {
    //     return "placement";
    //   } else {
    //     return move;
    //   }
    // };

    if (moveType) {
      const message = {
        moveType: moveType,
        currentPlayer: boardState.currentPlayer,
        pieceType: board[boardState.activePiece], // it's null in placement phase
        fromKey: fromKey,
        toKey: toKey,
      };
      setboardState((prev) => ({
        ...prev,
        selectedPiece: null,
        activePiece: null,
      }));
      // if yes get the move data and send to a callback to parent
      onMoveSend(message);
    }
  };

  const handlePieceHover = (row, col, isEntering) => {
    // console.log(`${isEntering ? "Entering" : "Leaving"} Piece at (${row}, ${col})`);
    // if the player and Piece type are same then hghlight the border with green
  };

  // Generate grid lines (horizontal and vertical)
  const renderGridLines = () => {
    const lines = [];

    // Horizontal lines
    for (let row = 0; row <= boardSize; row++) {
      const y = padding + row * cellSize;
      lines.push(
        <line
          key={`h-${row}`}
          x1={padding}
          y1={y}
          x2={padding + boardSize * cellSize}
          y2={y}
          className="stroke-gray-400"
          style={{ strokeWidth: 1.5 }}
        />
      );
    }

    // Vertical lines
    for (let col = 0; col <= boardSize; col++) {
      const x = padding + col * cellSize;
      lines.push(
        <line
          key={`v-${col}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={padding + boardSize * cellSize}
          className="stroke-gray-500 stroke-[1.5]"
        />
      );
    }

    return lines;
  };

  // Generate diagonal lines
  const renderDiagonalLines = () => {
    const lines = [];
    const startX = padding;
    const startY = padding;
    const endX = padding + boardSize * cellSize;
    const endY = padding + boardSize * cellSize;
    const centerX = padding + 2 * cellSize;
    const centerY = padding + 2 * cellSize;

    // Main diagonals (full board)
    lines.push(
      <line
        key="main-diag-1"
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        className="stroke-gray-500 stroke-[1.5]"
      />
    );

    lines.push(
      <line
        key="main-diag-2"
        x1={endX}
        y1={startY}
        x2={startX}
        y2={endY}
        className="stroke-gray-500 stroke-[1.5]"
      />
    );

    // Quadrant diagonals
    const quadrants = [
      { x1: startX, y1: startY, x2: centerX, y2: centerY }, // Top-left
      { x1: centerX, y1: startY, x2: endX, y2: centerY }, // Top-right
      { x1: startX, y1: centerY, x2: centerX, y2: endY }, // Bottom-left
      { x1: centerX, y1: centerY, x2: endX, y2: endY }, // Bottom-right
    ];

    quadrants.forEach((quad, index) => {
      // Diagonal from top-left to bottom-right of quadrant
      lines.push(
        <line
          key={`quad-diag-1-${index}`}
          x1={quad.x1}
          y1={quad.y1}
          x2={quad.x2}
          y2={quad.y2}
          className="stroke-gray-500 stroke-[1.5]"
        />
      );

      // Diagonal from top-right to bottom-left of quadrant
      lines.push(
        <line
          key={`quad-diag-2-${index}`}
          x1={quad.x2}
          y1={quad.y1}
          x2={quad.x1}
          y2={quad.y2}
          className="stroke-gray-500 stroke-[1.5]"
        />
      );
    });

    return lines;
  };

  // Generate intersection points
  const renderPieces = () => {
    const pieces = [];
    for (let row = 0; row <= boardSize; row++) {
      for (let col = 0; col <= boardSize; col++) {
        const x = padding + col * cellSize;
        const y = padding + row * cellSize;
        const pieceKey = `${row}-${col}`;
        const pieceType = board[pieceKey] || null;
        pieces.push(
          <Piece
            key={pieceKey}
            x={x}
            y={y}
            row={row}
            col={col}
            radius={pieceRadius}
            pieceType={pieceType}
            isSelected={boardState.selectedPiece === pieceKey}
            // isHighlighted={boardState.highlightedPieces.includes(pieceKey)}
            onClick={handlePieceClick}
            onHover={handlePieceHover}
          />
        );
      }
    }

    return pieces;
  };

  const handleSelection = (row, col, pieceType) => {
    const pieceKey = `${row}-${col}`;

    const isValidSelection = (pieceKey, pieceType) => {
      // for goat
      if (boardState.currentPlayer === "goat") {
        if (boardState.phase === "placement" && pieceType === null) {
          return true;
        } else if (boardState.phase === "displacement" && pieceType == "goat") {
          setboardState((prev) => ({ ...prev, activePiece: pieceKey }));
          return true;
        } else if (
          boardState.phase == "displacement" &&
          board[boardState.activePiece] === "goat" &&
          !pieceType
        ) {
          return true;
        }
      }

      // for tiger
      if (boardState.currentPlayer === "tiger") {
        if (pieceType === "tiger") {
          setboardState((prev) => ({ ...prev, activePiece: pieceKey }));
          return true;
        } else if (!pieceType && board[boardState.activePiece] === "tiger") {
          return true;
        }
      }

      return false;
    };

    // select/unselect
    if (isValidSelection(pieceKey, pieceType)) {
      if (boardState.selectedPiece === pieceKey) {
        setboardState((prev) => ({
          ...prev,
          selectedPiece: null,
          activePiece: null,
          // highlightedPieces: [],
        }));
        console.log(
          `disselected Piece at (${row}, ${col}) with piece: ${pieceType}`
        );
      } else {
        setboardState((prev) => ({
          ...prev,
          selectedPiece: pieceKey,
          // highlightedPieces: [...prev.highlightedPieces, pieceKey],
        }));
        console.log(
          `selected Piece at (${row}, ${col}) with piece: ${pieceType}`
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-5">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-8">Bagh Chal</h1> */}

      <div className="bg-white border-2 border-gray-600 rounded-lg p-5 shadow-lg">
        <svg width={svgSize} height={svgSize} className="bg-white">
          <g>{renderGridLines()}</g>

          <g>{renderDiagonalLines()}</g>

          <g>{renderPieces()}</g>
        </svg>
      </div>

      {/* <div className="mt-4 text-center text-gray-600">
        <p className="text-sm">Traditional Nepali Board Game</p>
        <p className="text-xs">25 Points • 4 Tigers vs 20 Goats</p>
      </div> */}
    </div>
  );
};

export default Board;
