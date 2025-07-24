import { useState, useEffect, useRef } from "react";
import Board from "./Board";

const initialGameState = {
  board: {
    // "0-0": "tiger",
    // "0-4": "tiger",
    // "4-0": "tiger",
    // "4-4": "tiger",
    // "1-1": "goat",
    // "1-3": "goat",
    // "3-1": "goat",
  },
  selectedPiece: null,
  activePiece: null,
  unusedGoat: 24,
  deadGoatCount: 0,
  currentPlayer: "goat",
  phase: "placement",
};

const Game = () => {
  const socketRef = useRef();
  const [gameState, setGameState] = useState(initialGameState);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("websocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const board = JSON.parse(event.data).message.board;
      setGameState((prev) => ({ ...prev, board: board })); // other parts need to be updated
    };

    socketRef.current.onclose = (event) => {
      console.log("websocket closed");
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const handleMoveSend = (message) => {
    if (socketRef.current.readyState === WebSocket.OPEN) {
      console.log("sending move ", message);
      socketRef.current.send(JSON.stringify({ message: message }));
    }
  };

  return (
    <>
      <Board board={gameState.board} onMoveSend={handleMoveSend} />
    </>
  );
};

export default Game;
