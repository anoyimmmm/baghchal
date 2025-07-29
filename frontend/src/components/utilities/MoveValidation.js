const moveConnections = {
  // Row 0
  "0-0": ["0-1", "1-0"],
  "0-1": ["0-0", "0-2"],
  "0-2": ["0-1", "0-3", "1-2"], // Only connects to center of row 1
  "0-3": ["0-2", "0-4"],
  "0-4": ["0-3", "1-4"],

  // Row 1
  "1-0": ["0-0", "1-1", "2-0"],
  "1-1": ["1-0", "1-2", "2-1"],
  "1-2": ["0-2", "1-1", "1-3", "2-2"], // Center point connects to 0-2 and 2-2
  "1-3": ["1-2", "1-4", "2-3"],
  "1-4": ["0-4", "1-3", "2-4"],

  // Row 2 (center row)
  "2-0": ["1-0", "2-1", "3-0"],
  "2-1": ["2-0", "2-2", "3-1"],
  "2-2": ["1-2", "2-1", "2-3", "3-2"], // Center point - key connection hub
  "2-3": ["2-2", "2-4", "3-3"],
  "2-4": ["1-4", "2-3", "3-4"],

  // Row 3
  "3-0": ["2-0", "3-1", "4-0"],
  "3-1": ["3-0", "3-2", "4-1"],
  "3-2": ["2-2", "3-1", "3-3", "4-2"], // Center point connects to 2-2 and 4-2
  "3-3": ["3-2", "3-4", "4-3"],
  "3-4": ["2-4", "3-3", "4-4"],

  // Row 4
  "4-0": ["3-0", "4-1"],
  "4-1": ["4-0", "4-2"],
  "4-2": ["3-2", "4-1", "4-3"], // Only connects to center of row 3
  "4-3": ["4-2", "4-4"],
  "4-4": ["3-4", "4-3"],
};

const captureConnections = {
  // Row 0
  "0-0": ["0-2"], // Can only capture 0-1 to land on 0-2
  "0-1": [], // No valid captures (can't jump over adjacent pieces)
  "0-2": ["0-0", "0-4", "2-2"], // Can capture 0-1→0-0, 0-3→0-4, 1-2→2-2
  "0-3": [], // No valid captures
  "0-4": ["0-2"], // Can capture 0-3 to land on 0-2

  // Row 1
  "1-0": ["3-0"], // Can capture 2-0 to land on 3-0
  "1-1": ["3-1"], // Can capture 2-1 to land on 3-1
  "1-2": ["1-0", "1-4", "3-2"], // Horizontal captures and vertical through center
  "1-3": ["3-3"], // Can capture 2-3 to land on 3-3
  "1-4": ["3-4"], // Can capture 2-4 to land on 3-4

  // Row 2 (center row)
  "2-0": ["4-0"], // Can capture 3-0 to land on 4-0
  "2-1": ["4-1"], // Can capture 3-1 to land on 4-1
  "2-2": ["0-2", "4-2", "2-0", "2-4"], // Vertical captures and horizontal
  "2-3": ["4-3"], // Can capture 3-3 to land on 4-3
  "2-4": ["4-4"], // Can capture 3-4 to land on 4-4

  // Row 3
  "3-0": ["1-0"], // Can capture 2-0 to land on 1-0
  "3-1": ["1-1"], // Can capture 2-1 to land on 1-1
  "3-2": ["1-2", "3-0", "3-4"], // Vertical and horizontal captures
  "3-3": ["1-3"], // Can capture 2-3 to land on 1-3
  "3-4": ["1-4"], // Can capture 2-4 to land on 1-4

  // Row 4
  "4-0": ["2-0"], // Can capture 3-0 to land on 2-0
  "4-1": ["2-1"], // Can capture 3-1 to land on 2-1
  "4-2": ["2-2", "4-0", "4-4"], // Vertical capture and horizontal
  "4-3": ["2-3"], // Can capture 3-3 to land on 2-3
  "4-4": ["2-4"], // Can capture 3-4 to land on 2-4
};
const ValidateMove = (fromKey, toKey, pieceType, GameBoard) => {
  // console.log(
  //   "fromkey",
  //   fromKey,
  //   "tokey",
  //   toKey,
  //   "piecetype",
  //   pieceType,
  //   "gameboard",
  //   GameBoard
  // );
  if (GameBoard[toKey]) {
    return null;
  }
  if (!fromKey) {
    return null;
  }
  if (moveConnections[fromKey].includes(toKey)) {
    console.log("displace");
    return "displace";
  }

  // for capture moves
  if (pieceType == "tiger" && captureConnections[fromKey].includes(toKey)) {
    return isValidCapture(fromKey, toKey, GameBoard);
  }
};

const isValidCapture = (fromKey, toKey, GameBoard) => {
  const [fromRow, fromCol] = fromKey.split("-").map(Number);
  const [toRow, toCol] = toKey.split("-").map(Number);
  const midRow = (fromRow + toRow) / 2;
  const midCol = (fromCol + toCol) / 2;
  const midKey = `${midRow}-${midCol}`;

  if (GameBoard[midKey] === "goat") {
    console.log("capture");
    return "capture";
  }
};

export default ValidateMove;
