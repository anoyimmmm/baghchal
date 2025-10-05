import { useState, useEffect, useRef, use, useContext } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import Board from "../components/Board";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import moveSound from "../assets/move_sound.mp3";
import PlayerCard from "../components/PlayerCard";
import GameStatus from "../components/GameStatus";

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
        <div className="flex-shrink-0">
          <PlayerCard
            isUserCard={false}
            username={auth.user?.username || auth.guestId}
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
            newPosition={gameState.newPosition}
            previousPosition={gameState.previousPosition}
          />
        </div>

        <div className="flex-shrink-0 ">
          <PlayerCard
            isUserCard={true}
            username={auth.user?.username || auth.guestId}
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

function WinnerModal({ winner, isOpen, onClose }) {
  if (!isOpen) return null;
  const navigate = useNavigate();

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
          onClick={() => {
            onClose();
            navigate("/");
          }}
          className="bg-gray-800 hover:bg-gray-900 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}

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
