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
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
          <div className="text-gray-800 font-light text-lg">
            {!isConnected ? "Connecting to game..." : "Loading game state..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col lg:flex-row justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Game Board Area */}
      <div className="flex-1 flex flex-col min-h-0 pt-20 md:pt-0 mb-10 md:mb-0">
        {/* <div className="flex-1 flex flex-col justify-center space-y-2 sm:space-y-4 min-h-0"> */}
        <div className="flex-shrink-0">
          <PlayerCard
            isUserCard={false}
            username={auth.user?.username}
            goatPlayer={gameState.player["goat"]}
            tigerPlayer={gameState.player["tiger"]}
            currentPlayer={gameState.currentPlayer}
            gameState={gameState}
          />
        </div>

        <div className="flex-1 flex justify-center items-center min-h-0 aspect-square">
          <Board
            board={gameState.board}
            currentPlayer={gameState.currentPlayer}
            phase={gameState.phase}
            onMoveSend={handleMoveSend}
            player={gameState.player}
            gameState={gameState}
          />
        </div>

        <div className="flex-shrink-0 ">
          <PlayerCard
            isUserCard={true}
            username={auth.user?.username}
            goatPlayer={gameState.player["goat"]}
            tigerPlayer={gameState.player["tiger"]}
            currentPlayer={gameState.currentPlayer}
            gameState={gameState}
          />
        </div>
        {/* </div> */}
      </div>

      {/* Game Status Sidebar */}
      <div className="w-full lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white lg:h-full shadow-lg">
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
  const getCurrentTurnDisplay = () => {
    if (gameState?.currentPlayer === "goat") {
      return `${gameState.player.goat || "Goat Player"}'s Turn`;
    } else {
      return `${gameState.player.tiger || "Tiger Player"}'s Turn`;
    }
  };

  const getGoatsOnBoard = () => {
    if (!gameState?.board) return 0;
    return Object.values(gameState.board).filter((piece) => piece === "goat")
      .length;
  };

  const getPhaseDisplay = () => {
    switch (gameState?.phase) {
      case "placement":
        return "Placement Phase";
      case "movement":
        return "Movement Phase";
      default:
        return "Unknown Phase";
    }
  };

  return (
    <div className="h-64 lg:h-full flex flex-col p-3 lg:p-4 font-sans">
      {/* Current Turn */}
      <div className="mb-4 lg:mb-6 flex-shrink-0">
        <h3 className="text-xs lg:text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
          Current Turn
        </h3>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-2 lg:p-3 border border-gray-200 shadow-sm">
          <div className="text-sm lg:text-lg font-bold text-gray-800">
            {getCurrentTurnDisplay()}
          </div>
          {/* <div className="text-xs lg:text-sm text-gray-600 mt-1 font-light">
            {getPhaseDisplay()}
          </div> */}
        </div>
      </div>

      <div className="mb-4 lg:mb-6 flex-shrink-0 ">
        {/* <h3 className="text-xs lg:text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2 lg:mb-3">
          Phase
        </h3> */}
        <div className="flex justify-between items-center py-1.5 lg:py-2 px-2 lg:px-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-gray-800 text-xs lg:text-sm font-medium">
            Phase
          </span>
          <span className="font-bold text-gray-800 text-xs lg:text-base">
            {gameState?.phase || 0}
          </span>
        </div>
      </div>
      {/* Game Statistics */}
      <div className="mb-4 lg:mb-6 flex-shrink-0 ">
        <h3 className="text-xs lg:text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2 lg:mb-3">
          Game Statistics
        </h3>
        <div className="space-y-2 lg:space-y-3">
          <div className="flex justify-between items-center py-1.5 lg:py-2 px-2 lg:px-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-gray-800 text-xs lg:text-sm font-medium">
              Goats Remaining
            </span>
            <span className="font-bold text-gray-800 text-xs lg:text-base">
              {gameState?.unusedGoat || 0}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 lg:py-2 px-2 lg:px-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-gray-800 text-xs lg:text-sm font-medium">
              Goats on Board
            </span>
            <span className="font-bold text-gray-800 text-xs lg:text-base">
              {getGoatsOnBoard()}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 lg:py-2 px-2 lg:px-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-gray-800 text-xs lg:text-sm font-medium">
              Goats Captured
            </span>
            <span className="font-bold text-gray-800 text-xs lg:text-base">
              {gameState?.deadGoatCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Move History */}
      <div className="flex-1 min-h-0">
        <h3 className="text-xs lg:text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2 lg:mb-3">
          Move History
        </h3>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-2 lg:p-3 h-full overflow-hidden flex flex-col border border-gray-200 shadow-sm">
          {!moveHistory || moveHistory.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-600 text-xs lg:text-sm font-light">
                No moves yet
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-1 lg:space-y-2">
              {moveHistory.map((move, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1 lg:py-2 px-2 lg:px-3 bg-white rounded-lg border border-gray-200 text-xs lg:text-sm shadow-sm"
                >
                  <span className="font-semibold text-gray-600 text-xs">
                    #{index + 1}
                  </span>
                  <span className="capitalize text-gray-800 font-bold">
                    {move.player}
                  </span>
                  <span className="text-gray-600 font-medium">{move.type}</span>
                  <span className="text-gray-600 text-xs font-light">
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
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 text-center font-sans">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Game Over!</h2>
        <p className="mb-6 text-lg text-gray-600 font-light">{winner} wins!</p>
        <button
          onClick={onClose}
          className="bg-gray-800 hover:bg-gray-900 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}

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

  return (
    <div
      className={`flex items-center justify-between px-2 py-1 rounded-xl border-2 transition-all max-w-sm mx-auto w-full font-sans shadow-sm ${
        isCurrentTurn
          ? "border-gray-800 bg-gray-800 text-white shadow-lg"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isCurrentTurn ? "bg-white" : "bg-gray-800"
          }`}
        >
          <span
            className={`text-xs font-bold uppercase ${
              isCurrentTurn ? "text-gray-800" : "text-white"
            }`}
          >
            {player.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <div
            className={`font-bold text-sm sm:text-base truncate ${
              isCurrentTurn ? "text-white" : "text-gray-800"
            }`}
          >
            {cardName}
          </div>
          <div
            className={`text-xs sm:text-sm capitalize font-light ${
              isCurrentTurn ? "text-gray-200" : "text-gray-600"
            }`}
          >
            {player}
          </div>
        </div>
      </div>

      {isCurrentTurn && (
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-gray-200 uppercase tracking-wider font-semibold">
            Your Turn
          </div>
          <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse ml-auto"></div>
        </div>
      )}
    </div>
  );
};

const WaitingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center font-sans">
        <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          Waiting for player...
        </h2>
        <p className="text-gray-600 font-light">
          Looking for another player to join the game
        </p>
      </div>
    </div>
  );
};
