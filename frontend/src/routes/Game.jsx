import { useState, useEffect, useContext } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import Board from "../components/Board";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import moveSound from "../assets/move_sound.mp3";
import PlayerCard from "../components/PlayerCard";
import GameStatusIndicator from "../components/GameStatusIndicator";

const Game = () => {
  const { auth } = useContext(AuthContext);
  const { send, gameState, isConnected, connect } = useWebSocket();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [winner, setWinner] = useState("");
  const [playMoveSound] = useSound(moveSound);

  let { gameId } = useParams();
  gameId = gameId.replace("game_", "");

  useEffect(() => {
    if (gameId && !isConnected) {
      // reconnect with the websocket
      connect(gameId, "rejoin");
    }
    if (gameState) {
      // if a piece has been placed or moved to new position
      if (gameState.newPosition) {
        playMoveSound();
      }
      if (gameState.status === "over") {
        setWinner(gameState.winner);
        setModalOpen(true);
      }
    } else {
      console.log("no game state");
    }
  }, [gameState]);

  if (!(auth.user || auth.guestId)) {
    navigate("/");
  }

  const handleMoveSend = (move) => {
    console.log("sending move ", move);
    send(JSON.stringify(move));
  };

  if (!isConnected || !gameState) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#262522]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#3a3835] border-t-[#f95e5e] rounded-full animate-spin mx-auto"></div>
          <div className="text-gray-300 font-light text-lg">
            {!isConnected ? "Connecting to game..." : "Loading game state..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col lg:flex-row justify-center bg-[#262522] overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 md:pt-0">
        {/* Player Cards Row */}
        <div className="px-2 py-2">
          <PlayerCard
            username={auth.user?.username || auth.guestId}
            goatPlayer={gameState.player["goat"]}
            tigerPlayer={gameState.player["tiger"]}
            currentPlayer={gameState.player[gameState.currentPlayer]}
            gameState={gameState}
          />
        </div>

        {/* Board */}
        <div className="flex-1 flex justify-center items-center min-h-0">
          <Board
            board={gameState.board}
            currentPlayer={gameState.currentPlayer}
            phase={gameState.phase}
            onMoveSend={handleMoveSend}
            player={gameState.player}
            gameState={gameState}
            newPosition={gameState.newPosition}
            previousPosition={gameState.previousPosition}
          />
        </div>
      </div>

      {/* Game Status Sidebar */}
      <div className="w-full lg:w-60 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-[#3a3835] bg-[#2f2d2a] lg:h-full shadow-2xl">
        <GameStatusIndicator
          gameState={gameState}
          moveHistory={gameState.history}
        />
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

function WinnerModal({ winner, isOpen, onClose }) {
  if (!isOpen) return null;
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#2f2d2a] rounded-xl shadow-2xl max-w-md w-full mx-4 p-8 text-center border border-[#3a3835]">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-3 text-white">Game Over!</h2>
        <p className="mb-8 text-xl text-gray-300">{winner} wins!</p>
        <button
          onClick={() => {
            onClose();
            navigate("/");
          }}
          className="bg-[#f95e5e] hover:bg-[#d94545] px-8 py-3 rounded-lg text-white font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

const WaitingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#2f2d2a] rounded-xl shadow-2xl max-w-md w-full mx-4 p-8 text-center border border-[#3a3835]">
        <div className="w-12 h-12 border-4 border-[#3a3835] border-t-[#f95e5e] rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold mb-3 text-white">
          Waiting for player...
        </h2>
        <p className="text-gray-400">
          Looking for another player to join the game
        </p>
      </div>
    </div>
  );
};
