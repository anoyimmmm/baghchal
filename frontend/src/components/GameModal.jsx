import { useState, useEffect } from "react";
import { useWebSocket } from "../context/WebSocketContext";

function GameModal({ mode, isOpen, onClose }) {
  if (!isOpen) return null;

  const { connect } = useWebSocket();
  const [gameId, setGameId] = useState("");
  const [joinId, setJoinId] = useState("");
  const [playerRole, setPlayerRole] = useState("");

  const generateGameId = () => {
    return crypto.randomUUID();
  };

  useEffect(() => {
    if (mode === "create") {
      setGameId(generateGameId());
      setPlayerRole("tiger"); // default value for create mode
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
    connect(gameId, "create", playerRole);
  };

  const handleJoin = () => {
    console.log("Joining game:", joinId);
    connect(joinId.trim(), "join", playerRole);
  };

  const handleQuick = () => {
    console.log("Searching for quick game");
    connect("", "quick", playerRole);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-130 mx-auto border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 capitalize flex items-center space-x-3">
            <span className="text-3xl">
              {mode === "create" ? "🎯" : mode === "join" ? "🤝" : "⚡"}
            </span>
            <span>{mode} Game</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {mode === "create" && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">
                Share this Game ID with a friend:
              </p>
              <div className="bg-gray-100 border border-gray-300 p-4 rounded-xl flex justify-between items-center">
                <span className="font-mono text-gray-800 break-all mr-3">
                  {gameId}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-gray-600 hover:text-gray-800 px-3 py-1 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-3 text-gray-700 font-medium">
                Choose your role:
              </label>
              <select
                value={playerRole}
                onChange={(e) => setPlayerRole(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              >
                <option value="tiger">🐅 Tiger (Hunter)</option>
                <option value="goat">🐐 Goat (Defender)</option>
              </select>
            </div>

            <button
              onClick={handleCreate}
              className="bg-gray-800 text-white px-6 py-3 rounded-xl w-full hover:bg-gray-900 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
              Create Game Room
            </button>
          </div>
        )}

        {mode === "join" && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">Enter the Game ID to join:</p>
              <input
                type="text"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                className="w-full p-4 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                placeholder="Paste Game ID here..."
              />
            </div>

            <div>
              <label className="block mb-3 text-gray-700 font-medium">
                Choose your role:
              </label>
              <select
                value={playerRole}
                onChange={(e) => setPlayerRole(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              >
                <option value="">Select your role...</option>
                <option value="tiger">🐅 Tiger (Hunter)</option>
                <option value="goat">🐐 Goat (Defender)</option>
              </select>
            </div>

            <button
              onClick={handleJoin}
              disabled={!joinId.trim() || !playerRole}
              className="bg-gray-800 text-white px-6 py-3 rounded-xl w-full hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:transform-none disabled:shadow-lg"
            >
              Join Game
            </button>
          </div>
        )}

        {mode === "quick" && (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              </div>
              <p className="text-gray-600">Looking for a quick match...</p>
              <p className="text-gray-500 text-sm mt-2">
                We'll match you with another player shortly
              </p>
            </div>

            <div>
              <label className="block mb-3 text-gray-700 font-medium">
                Preferred role:
              </label>
              <select
                value={playerRole}
                onChange={(e) => setPlayerRole(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              >
                <option value="">No preference</option>
                <option value="tiger">🐯 Tiger (Hunter)</option>
                <option value="goat">🐐 Goat (Defender)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameModal;
