import { useState, useEffect, useRef, use } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import Board from "./Board";
const initialGameState = {
  board: {
    "0-0": "tiger",
    "0-4": "tiger",
    "4-0": "tiger",
    "4-4": "tiger",
  },
  currentPlayer: "goat",
  phase: "placement",
  unusedGoat: 20,
  deadGoatCount: 0,
  status: "waiting",
  winner: null,
};

const Game = () => {
  const { send, gameState } = useWebSocket();
  const [modalOpen, setModalOpen] = useState(false);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    // const wsUrl = import.meta.env.VITE_WS_URL;
    if (gameState.status === "over") {
      setWinner(gameState.winner);
      setModalOpen(true);
    }
  }, [gameState]);

  const handleMoveSend = (move) => {
    console.log("sending move ", move);
    console.log("stringified ", JSON.stringify(move));
    send(JSON.stringify(move));
  };

  return (
    <div className="flex h-full w-full flex-row justify-evenly">
      <div className="flex flex-col  justify-center overflow-hidden px-10 aspect-square ">
        player 1
        {gameState && (
          <Board
            board={gameState.board}
            currentPlayer={gameState.currentPlayer} // or gameState.currentPlayer if your backend uses that
            phase={gameState.phase} // or gameState.phase if your backend uses that
            onMoveSend={handleMoveSend}
          />
        )}
        player 2
      </div>
      <GameStatus gameState={gameState} />
      <WinnerModal
        winner={winner}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Game;

const GameStatus = ({ gameState, moveHistory }) => {
  return (
    <div className=" bg-white border-l border-gray-300 p-4 flex flex-col h-full w-80">
      {/* Game Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Game Status
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-600">Current Turn:</span>
            <span className="font-semibold capitalize text-gray-800">
              {gameState?.currentPlayer || "goat"}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <span className="text-gray-600">Phase:</span>
            <span className="font-semibold capitalize text-gray-800">
              {gameState?.phase || "placement"}
            </span>
          </div>
        </div>
      </div>

      {/* Piece Counts */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Piece Status
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 px-3 bg-amber-50 rounded">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <span className="text-gray-600">Tigers on Board:</span>
            </div>
            <span className="font-semibold text-gray-800">4</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Goats Remaining:</span>
            </div>
            <span className="font-semibold text-gray-800">
              {gameState?.unusedGoat || 20}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 bg-red-50 rounded">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Goats Captured:</span>
            </div>
            <span className="font-semibold text-gray-800">
              {gameState?.deadGoatCount || 0}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Goats on Board:</span>
            </div>
            <span className="font-semibold text-gray-800">
              {20 -
                (gameState?.unusedGoat || 20) -
                (gameState?.deadGoatCount || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Move History */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Move History
        </h3>
        <div className="bg-gray-50 rounded p-3 h-64 overflow-y-auto">
          {!moveHistory || moveHistory.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-8">
              No moves yet
            </p>
          ) : (
            <div className="space-y-2">
              {moveHistory.map((move, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1 px-2 bg-white rounded text-sm"
                >
                  <span className="font-medium text-gray-600">
                    #{index + 1}
                  </span>
                  <span className="capitalize text-gray-800">
                    {move.player}
                  </span>
                  <span className="text-gray-600">{move.type}</span>
                  <span className="text-gray-500">
                    {move.from} → {move.to}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Game Rules (compact) */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Quick Rules
        </h3>
        <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded">
          <p>• Tigers start at four corners</p>
          <p>• Goats place first (20 pieces), then move</p>
          <p>• Tigers win by capturing 5 goats</p>
          <p>• Goats win by blocking all tigers</p>
        </div>
      </div>
    </div>
  );
};

function WinnerModal({ winner, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50 bg-gray-200/70
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
