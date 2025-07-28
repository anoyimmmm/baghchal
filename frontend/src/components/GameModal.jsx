import { useState, useEffect } from "react";

function GameModal({ mode, isOpen, onClose }) {
  if (!isOpen) return null;
  //todo: if the user is not logged in redirect to login/signup

  const generateGameId = () => {
    // generate a unique uuid for the game
    return crypto.randomUUID();
  };

  const [gameId, setGameId] = useState("");
  const [joinId, setJoinId] = useState("");

  useEffect(() => {
    if (mode === "create") {
      setGameId(generateGameId());
    }
  }, [mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(gameId);
    alert("Game ID copied!");
  };

  const handleJoin = () => {
    console.log("Joining game:", joinId);
    // add actual navigation/join logic here
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
            <button
              onClick={handleJoin}
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
