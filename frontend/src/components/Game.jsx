import { useState, useEffect, useRef, use, useContext } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import Board from "./Board";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const { auth } = useContext(AuthContext);
  const { send, gameState, isConnected, connect } = useWebSocket();
  const [modalOpen, setModalOpen] = useState(false);
  const [winner, setWinner] = useState("");
  const navigate = useNavigate();
  let { gameId } = useParams();
  gameId = gameId.replace("game_", "");

  useEffect(() => {
    if (gameId && !isConnected) {
      // reconnect with the websocket
      connect(gameId, "rejoin");
    }
    if (gameState) {
      if (gameState.status === "over") {
        setWinner(gameState.winner);
        setModalOpen(true);
      }
    } else {
      console.log("no game state");
    }
  }, [gameState]);
  if (!auth.user) {
    navigate("/");
  }

  const handleMoveSend = (move) => {
    console.log("sending move ", move);
    send(JSON.stringify(move));
  };

  if (!isConnected || !gameState) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-lg text-gray-600">
          {!isConnected ? "Connecting to game..." : "Loading game state..."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full">
      {/* Game Board Area - Takes priority for space */}
      <div className="flex flex-col justify-center py-16 lg:p-0 flex-1 p-5">
        <PlayerCard
          isUserCard={false}
          username={auth.user.username}
          goatPlayer={gameState.player["goat"]}
          tigerPlayer={gameState.player["tiger"]}
          currentPlayer={gameState.currentPlayer}
          gameState={gameState}
        />
        <div className="flex justify-center align-middle">
          <Board
            board={gameState.board}
            currentPlayer={gameState.currentPlayer}
            phase={gameState.phase}
            onMoveSend={handleMoveSend}
            player={gameState.player}
            gameState={gameState}
          />
        </div>
        <PlayerCard
          isUserCard={true}
          username={auth.user?.username}
          goatPlayer={gameState.player["goat"]}
          tigerPlayer={gameState.player["tiger"]}
          currentPlayer={gameState.currentPlayer}
        />
      </div>

      {/* Game Status - Takes remaining space */}
      <div className="flex-shrink-0 lg:w-80">
        <GameStatus gameState={gameState} />
      </div>

      <WinnerModal
        winner={winner}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <WaitingModal isOpen={gameState?.status === "waiting"} />
    </div>
  );
};

export default Game;

const GameStatus = ({ gameState, moveHistory }) => {
  return (
    <div className="bg-white border-t lg:border-t-0 lg:border-l border-gray-300 p-4 flex flex-col w-full lg:w-80 h-64 lg:h-full overflow-y-auto">
      {/* Piece Counts */}
      <div className="mb-4 lg:mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Game Status
        </h3>
        <div className="space-y-2">
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
        </div>
      </div>

      {/* Move History */}
      <div className="flex-1 min-h-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Move History
        </h3>
        <div className="bg-gray-50 rounded p-3 h-full overflow-y-auto">
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
    </div>
  );
};

function WinnerModal({ winner, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-gray-200/70"
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

// Add this new component
// Replace the PlayerCard component with this:
const PlayerCard = ({
  isUserCard,
  username,
  goatPlayer,
  tigerPlayer,
  currentPlayer,
  gameState,
}) => {
  // Determine which player this card represents
  let player = "";
  let cardName = "";

  if (isUserCard) {
    // This is the current user's card
    player = username === goatPlayer ? "goat" : "tiger";
    cardName = username;
  } else {
    // This is the opponent's card
    if (username === goatPlayer) {
      player = "tiger";
      cardName = tigerPlayer;
    } else {
      player = "goat";
      cardName = goatPlayer;
    }
  }

  const isCurrentTurn = currentPlayer === player;
  const bgColor = player === "tiger" ? "bg-amber-500" : "bg-green-500";
  const highlightColor = player === "tiger" ? "bg-amber-400" : "bg-green-400";

  // Get count based on player type
  const count =
    player === "goat"
      ? gameState?.unusedGoat || 20 // Goats remaining to place (unused goats)
      : gameState?.deadGoatCount || 0; // Goats captured by tigers (goats killed)

  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg w-full my-3 lg:w-170 mx-auto ${
        isCurrentTurn ? "shadow-lg bg-gray-300" : ""
      }`}
    >
      <div className="flex items-center">
        <div className={`w-6 h-6 ${bgColor} rounded-full mr-2`}></div>
        <div>
          <div className="font-semibold text-gray-800 text-sm">{cardName}</div>
          <div className="text-xs text-gray-600 capitalize">{player}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-s text-gray-500">
          {player === "goat" ? "Remaining" : "Captured"}
        </div>
        <div className="font-bold text-gray-800">{count}</div>
      </div>
    </div>
  );
};

// Add this new component
const WaitingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-200/70">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Waiting for player...
        </h2>
        <p className="text-gray-600">
          Looking for another player to join the game
        </p>
      </div>
    </div>
  );
};
