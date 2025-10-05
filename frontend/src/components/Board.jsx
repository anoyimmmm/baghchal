import React, { useState, useEffect, useRef, useContext } from "react";
import Piece from "./Piece";
import ValidateMove from "./utilities/MoveValidation.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Board = ({
  board,
  currentPlayer,
  phase,
  onMoveSend,
  player,
  newPosition,
  previousPosition,
}) => {
  const { auth } = useContext(AuthContext);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  const boardSize = 4;

  // Calculate responsive dimensions
  const containerPadding = 0; // Padding for the border container
  const availableSize =
    Math.min(dimensions.width, dimensions.height) - containerPadding;
  const cellSize = availableSize / 5; // 4 cells + padding adjustment
  const pieceRadius = Math.max(cellSize * 0.25, 8); // Minimum 8px radius
  const padding = cellSize / 2; // Internal SVG padding
  const svgSize = availableSize;

  const [boardState, setboardState] = useState({
    selectedPiece: null,
    activePiece: null,
  });

  // Handle window resize and container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        // Get the actual available space
        const containerWidth = rect.width;
        const containerHeight = rect.height;

        // Calculate the maximum size that fits maintaining square aspect ratio
        const maxSize = Math.min(containerWidth, containerHeight);

        setDimensions({
          width: maxSize,
          height: maxSize,
        });
      }
    };

    // Initial calculation with a small delay to ensure DOM is ready
    const timer = setTimeout(updateDimensions, 0);

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    // Use ResizeObserver for container size changes if available
    let resizeObserver;
    if (window.ResizeObserver && containerRef.current) {
      resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  // handle piece clicks
  const handlePieceClick = (row, col, pieceType) => {
    if (![auth.user?.username, auth.guestId].includes(player[currentPlayer]))
      return;

    const pieceKey = `${row}-${col}`;
    handleSelection(row, col, pieceType);

    const fromKey = boardState.activePiece;
    const toKey = pieceKey;
    const moveType =
      ValidateMove(fromKey, toKey, board[boardState.activePiece], board) ||
      (phase == "placement" && !board[pieceKey] && currentPlayer == "goat"
        ? "place"
        : "");

    if (moveType) {
      const move = {
        moveType: moveType,
        currentPlayer: currentPlayer,
        pieceType: board[boardState.activePiece],
        fromKey: fromKey,
        toKey: toKey,
      };
      setboardState((prev) => ({
        ...prev,
        selectedPiece: null,
        activePiece: null,
      }));
      onMoveSend(move);
    }
  };

  // handle hover
  const handlePieceHover = (row, col, isEntering) => {};

  // draw grid lines
  const renderGridLines = () => {
    const lines = [];
    const strokeWidth = Math.max(1, cellSize * 0.008);

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
          style={{ strokeWidth }}
        />
      );
    }
    for (let col = 0; col <= boardSize; col++) {
      const x = padding + col * cellSize;
      lines.push(
        <line
          key={`v-${col}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={padding + boardSize * cellSize}
          className="stroke-gray-400"
          style={{ strokeWidth }}
        />
      );
    }
    return lines;
  };

  // draw diagonals
  const renderDiagonalLines = () => {
    const lines = [];
    const startX = padding;
    const startY = padding;
    const endX = padding + boardSize * cellSize;
    const endY = padding + boardSize * cellSize;
    const centerX = padding + 2 * cellSize;
    const centerY = padding + 2 * cellSize;

    const strokeWidth = Math.max(1, cellSize * 0.008);

    // main diagonals
    lines.push(
      <line
        key="main-diag-1"
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        className="stroke-gray-400"
        style={{ strokeWidth }}
      />
    );
    lines.push(
      <line
        key="main-diag-2"
        x1={endX}
        y1={startY}
        x2={startX}
        y2={endY}
        className="stroke-gray-400"
        style={{ strokeWidth }}
      />
    );

    // quadrant diagonals
    const quadrants = [
      { x1: startX, y1: startY, x2: centerX, y2: centerY },
      { x1: centerX, y1: startY, x2: endX, y2: centerY },
      { x1: startX, y1: centerY, x2: centerX, y2: endY },
      { x1: centerX, y1: centerY, x2: endX, y2: endY },
    ];

    quadrants.forEach((quad, index) => {
      lines.push(
        <line
          key={`quad-diag-1-${index}`}
          x1={quad.x1}
          y1={quad.y1}
          x2={quad.x2}
          y2={quad.y2}
          className="stroke-gray-400"
          style={{ strokeWidth }}
        />
      );
      lines.push(
        <line
          key={`quad-diag-2-${index}`}
          x1={quad.x2}
          y1={quad.y1}
          x2={quad.x1}
          y2={quad.y2}
          className="stroke-gray-400"
          style={{ strokeWidth }}
        />
      );
    });

    return lines;
  };

  // render all the pieces on board
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
            onClick={handlePieceClick}
            onHover={handlePieceHover}
            isPreviousPosition={previousPosition === pieceKey}
            isNewPosition={newPosition === pieceKey}
          />
        );
      }
    }
    return pieces;
  };

  // handle selection logic
  const handleSelection = (row, col, pieceType) => {
    const pieceKey = `${row}-${col}`;

    const isValidSelection = (pieceKey, pieceType) => {
      // goat logic
      if (currentPlayer === "goat") {
        if (phase === "placement" && pieceType === null) {
          return true;
        } else if (phase === "displacement" && pieceType == "goat") {
          setboardState((prev) => ({ ...prev, activePiece: pieceKey }));
          return true;
        } else if (
          phase == "displacement" &&
          board[boardState.activePiece] === "goat" &&
          !pieceType
        ) {
          return true;
        }
      }
      // tiger logic
      if (currentPlayer === "tiger") {
        if (pieceType === "tiger") {
          setboardState((prev) => ({ ...prev, activePiece: pieceKey }));
          return true;
        } else if (!pieceType && board[boardState.activePiece] === "tiger") {
          return true;
        }
      }
      return false;
    };

    if (isValidSelection(pieceKey, pieceType)) {
      if (boardState.selectedPiece === pieceKey) {
        setboardState((prev) => ({
          ...prev,
          selectedPiece: null,
          activePiece: null,
        }));
        console.log(
          `disselected Piece at (${row}, ${col}) with piece: ${pieceType}`
        );
      } else {
        setboardState((prev) => ({
          ...prev,
          selectedPiece: pieceKey,
        }));
        console.log(
          `selected Piece at (${row}, ${col}) with piece: ${pieceType}`
        );
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full aspect-square flex items-center justify-center p-2"
    >
      <div
        className="border-2 border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden"
        style={{
          width: svgSize + containerPadding,
          height: svgSize + containerPadding,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <svg
          width={svgSize}
          height={svgSize}
          className="w-full h-full"
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          style={{
            display: "block",
            margin: containerPadding / 2,
          }}
        >
          <g>{renderGridLines()}</g>
          <g>{renderDiagonalLines()}</g>
          <g>{renderPieces()}</g>
        </svg>
      </div>
    </div>
  );
};

export default Board;
