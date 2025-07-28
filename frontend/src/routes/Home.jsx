import { useState, useEffect } from "react";
import board from "../assets/board.png";
const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("");
  return (
    <>
      <div className="font-sans text-gray-800 bg-gray-100">
        {/* Hero Section */}
        <section className="bg-white py-15">
          <div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Bagh Chal
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Experience the traditional Nepali strategy game where tigers
                hunt and goats defend. A timeless battle of wits that has
                entertained generations across Nepal.
              </p>
              {/* game buttons container  */}
              <div className="flex flex-col space-y-4 max-w-xs">
                <button
                  className="btn bg-gray-800 text-white rounded-lg py-3 px-6 font-semibold hover:bg-gray-900 transition"
                  onClick={() => {
                    setModalOpen(true);
                    setMode("create");
                  }}
                >
                  Create Game
                </button>
                <button
                  className="btn bg-gray-800 text-white rounded-lg py-3 px-6 font-semibold hover:bg-gray-900 transition"
                  onClick={() => {
                    setModalOpen(true);
                    setMode("join");
                  }}
                >
                  Join Game
                </button>
                <button
                  className="btn bg-gray-800 text-white rounded-lg py-3 px-6 font-semibold hover:bg-gray-900 transition"
                  onClick={() => {
                    setModalOpen(true);
                    setMode("quick");
                  }}
                >
                  Quick Game
                </button>
              </div>
            </div>

            {/* the board image continer */}
            <div className="flex justify-center">
              <div className="w-[300px] md:w-[400px] bg-white p-6 md:p-8 rounded-xl shadow-lg">
                <div>
                  <img
                    src={board}
                    alt="baghchal board image"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Rules Section */}
        <section id="rules" className="py-16 bg-gray-100">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl font-bold text-center mb-12">
              Quick Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Setup",
                  description:
                    "4 tigers start at the four corners of the board. Goats enter the game one by one during the placement phase.",
                },
                {
                  title: "Goat Phase",
                  description:
                    "Goats are placed one at a time on empty intersections. After all 20 goats are placed, they can move to adjacent empty points.",
                },
                {
                  title: "Tiger Moves",
                  description:
                    "Tigers can move to adjacent empty points or jump over a goat to capture it. Tigers need to capture 5 goats to win.",
                },
                {
                  title: "Winning",
                  description:
                    "Tigers win by capturing 5 goats. Goats win by surrounding all tigers so they cannot move or capture.",
                },
              ].map((rule, i) => (
                <div
                  key={i}
                  className="bg-white p-6 border-l-4 border-gray-800 rounded-lg shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {rule.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Play Section */}
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Play Bagh Chal?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🧠",
                  title: "Strategic Thinking",
                  description:
                    "Develop your tactical skills with this asymmetric game where each side has unique abilities and different paths to victory.",
                },
                {
                  icon: "🏛️",
                  title: "Cultural Heritage",
                  description:
                    "Connect with centuries of Nepali tradition through this classic board game that has been passed down through generations.",
                },
                {
                  icon: "⚡",
                  title: "Quick to Learn",
                  description:
                    "Simple rules make it accessible to players of all ages, but the depth of strategy will keep you coming back for more.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="text-center p-6 bg-gray-100 rounded-xl hover:-translate-y-1 transition-transform"
                >
                  <div className="w-16 h-16 mx-auto flex items-center justify-center text-white text-2xl bg-gray-800 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-12">
          <div className="container mx-auto px-5">
            <p className="text-gray-400">
              &copy; 2024 Bagh Chal. Traditional Nepali Board Game - Connecting
              Cultures Through Play.
            </p>
          </div>
        </footer>
      </div>
      <GameModal
        mode={mode}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default Home;

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
