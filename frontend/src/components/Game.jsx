import { useState, useEffect, useRef, use } from "react";
import Board from "./Board";
const initialGameState = {
  board: {
    "0-0": "tiger",
    "0-4": "tiger",
    "4-0": "tiger",
    "4-4": "tiger",
  },
  status: "ongoing",
  currentPlayer: "goat",
  phase: "placement",
  unusedGoat: 20,
  deadGoatCount: 0,
  status: "ongoing",
  winner: null,
};

const Game = () => {
  const socketRef = useRef();
  const [gameState, setGameState] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("websocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const new_game_state = JSON.parse(event.data).message.game_state;
      // console.log(new_game_state);
      setGameState(new_game_state);
      if (new_game_state.status !== "ongoing") {
        console.log("hello world");
        setWinner(new_game_state.winner);
        setModalOpen(true);
      }
    };

    socketRef.current.onclose = () => {
      console.log("websocket closed");
    };

    return () => {
      socketRef.current.close();
    };
  }, []); // 🧠 Don't forget the closing ] here

  const handleMoveSend = (message) => {
    if (socketRef.current.readyState === WebSocket.OPEN) {
      console.log("sending move ", message);
      socketRef.current.send(JSON.stringify({ message }));
    }
  };

  return (
    <>
      {gameState && (
        <Board
          board={gameState.board}
          currentPlayer={gameState.currentPlayer} // or gameState.currentPlayer if your backend uses that
          phase={gameState.phase} // or gameState.phase if your backend uses that
          onMoveSend={handleMoveSend}
        />
      )}
      <WinnerModal
        winner={winner}
        isOpen={modalOpen}
        // onclose={() => setModalOpen(false)}
      />
    </>
  );
};

export default Game;

function WinnerModal({ winner, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50
"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">🎉 Congratulations!</h2>
        <p className="mb-6 text-lg">{winner} is the winner!</p>
        <button
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
