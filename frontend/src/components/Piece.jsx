import { useState } from "react";
import goat from "../assets/goat.png";
import tiger from "../assets/tiger.png";
// Piece Component - handles individual board positions
const Piece = ({
  x,
  y,
  row,
  col,
  radius,
  pieceType = null, // 'tiger', 'goat', or null
  isSelected = false,
  isHighlighted = false,
  onClick,
  onHover,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(row, col, true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(row, col, false);
  };

  // Circle styles based on state
  const getCircleStyle = () => {
    let fill = "white";
    let stroke = "#666";
    let strokeWidth = 2;

    if (isSelected) {
      stroke = "#3b82f6"; // blue
      strokeWidth = 4;
    } else if (isHighlighted) {
      stroke = "#10b981"; // green
      strokeWidth = 3;
    } else if (isHovered) {
      strokeWidth = 3;
      fill = "#c7c5c5";
    }

    return {
      fill,
      stroke,
      strokeWidth,
      cursor: "pointer",
    };
  };

  // Render piece image if present
  const renderPiece = () => {
    if (!pieceType) return null;

    const imageSize = radius * 1.8; // Make image slightly larger than circle
    const imageX = x - imageSize / 2;
    const imageY = y - imageSize / 2;

    return (
      <image
        x={imageX}
        y={imageY}
        width={imageSize}
        height={imageSize}
        href={pieceType === "tiger" ? tiger : goat}
        style={{ pointerEvents: "none" }}
      />
    );
  };

  return (
    <g>
      {/* Base circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        style={getCircleStyle()}
        onClick={() => {
          onClick(row, col, pieceType);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-row={row}
        data-col={col}
      />

      {/* Piece (tiger or goat) */}
      {renderPiece()}
    </g>
  );
};

export default Piece;
