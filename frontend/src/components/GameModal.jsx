import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useWebSocket } from "../context/WebSocketContext";

function GameModal({ mode, isOpen, onClose }) {
  if (!isOpen) return null;

  const { connect } = useWebSocket();
  const { auth, setAuth } = useContext(AuthContext);
  const [gameId, setGameId] = useState("");
  const [joinId, setJoinId] = useState("");
  const [playerRole, setPlayerRole] = useState("tiger");

  const connectToGame = (gameId, mode, role) => {
    const params = new URLSearchParams({
      game_id: gameId,
      mode: mode,
      role: role,
      user_id: auth.user?.id || "",
    });

    const wsUrl = `ws://localhost:8000/ws/game/?${params}`;
    console.log(wsUrl);
    connect(wsUrl);
  };

  const generateGameId = () => {
    return crypto.randomUUID();
  };

  useEffect(() => {
    if (mode === "create") {
      setGameId(generateGameId());
    } else if (mode === "quick") {
      handleQuick();
    }
  }, [mode]);

  const handleCopy = async (event) => {
    try {
      await navigator.clipboard.writeText(gameId);
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setError("Failed to copy to clipboard");
    }
  };

  const handleCreate = () => {
    connectToGame(gameId, "create", playerRole);
  };

  const handleJoin = () => {
    console.log("Joining game:", joinId);
    connectToGame(joinId.trim(), "join", playerRole);
  };

  const handleQuick = () => {
    console.log("Searching for quick game");
    connectToGame("", "quick", playerRole);
  };

  return (
    <div className=" fixed inset-0 bg-gray-200/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-120">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold capitalize">{mode} Game</h2>
          <button onClick={onClose} className="text-white text-sm">
            ✖
          </button>
        </div>

        {mode === "create" && (
          <div>
            <p className="mb-2">Share this Game ID with a friend:</p>
            <div className="bg-gray-700 p-2 my-2 rounded flex justify-between items-center">
              <span className="font-mono">{gameId}</span>
              <button
                onClick={handleCopy}
                className="ml-2 text-sm text-blue-400 hover:underline"
              >
                Copy
              </button>
            </div>
            <label className="block mb-2 text-sm text-white">
              Choose your role:
            </label>
            <select
              value={playerRole}
              onChange={(e) => setPlayerRole(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            >
              <option value="tiger">Tiger</option>
              <option value="goat">Goat</option>
            </select>
            <button
              onClick={handleCreate}
              className="bg-white text-gray-800  my-2 px-4 py-2 rounded w-full hover:bg-gray-300"
            >
              Create
            </button>
          </div>
        )}

        {mode === "join" && (
          <div>
            <p className="mb-2">Enter Game ID:</p>
            <input
              type="text"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 mb-4"
              placeholder="Game ID"
            />
            <button
              onClick={handleJoin}
              className="bg-white text-gray-800 px-4 py-2 rounded w-full hover:bg-gray-300"
            >
              Join
            </button>
          </div>
        )}

        {mode === "quick" && (
          <p className="text-sm text-gray-300">Looking for a quick match...</p>
        )}
      </div>
    </div>
  );
}

export default GameModal;
