import { useState, useEffect, useContext } from "react";
import axios from "axios";
import board from "../assets/board.png";
import GameModal from "../components/GameModal";
import AuthModal from "../components/AuthModal";
import { AuthContext } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [gameMode, setGameMode] = useState("");
  const setAuthModalOpen = useOutletContext();

  const handleClick = (mode) => {
    if (!auth.isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    setGameModalOpen(true);
    setGameMode(mode);
  };

  return (
    <>
      <div className="font-sans text-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen overflow-x-hidden w-full">
        {/* Enhanced Hero Section */}
        <section className="min-h-screen flex items-center justify-center ">
          <div className="container px-4  w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Content Side */}
              <div className="space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mt-17 md:mt-0">
                    Bagh Chal
                  </h1>
                  <div className="w-24 h-1 bg-gray-800 mx-auto lg:mx-0"></div>
                  <p className="text-xl md:text-2xl text-gray-600 font-light">
                    The Ancient Game of Strategy
                  </p>
                </div>

                <p className="hidden md:block text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Experience the legendary Nepali board game where cunning
                  tigers hunt and strategic goats defend. A timeless battle of
                  wits that has captivated minds across the Himalayas for
                  centuries.
                </p>

                {/* Enhanced Game Buttons */}
                <div className="space-y-4 max-w-sm mx-auto lg:mx-0">
                  <button
                    className="w-full bg-gray-800 text-white rounded-xl py-4 px-8 text-lg font-semibold 
                             hover:bg-gray-900 hover:shadow-lg transform hover:-translate-y-0.5 
                             transition-all duration-300 flex items-center justify-center space-x-3"
                    onClick={() => handleClick("create")}
                  >
                    <span>🎯</span>
                    <span>Create Game</span>
                  </button>

                  <button
                    className="w-full bg-white text-gray-800 border-2 border-gray-800 rounded-xl py-4 px-8 
                             text-lg font-semibold hover:bg-gray-800 hover:text-white hover:shadow-lg 
                             transform hover:-translate-y-0.5 transition-all duration-300 
                             flex items-center justify-center space-x-3"
                    onClick={() => handleClick("join")}
                  >
                    <span>🤝</span>
                    <span>Join Game</span>
                  </button>

                  <button
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl 
                             py-4 px-8 text-lg font-semibold hover:from-gray-800 hover:to-gray-950 
                             hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 
                             flex items-center justify-center space-x-3"
                    onClick={() => handleClick("quick")}
                  >
                    <span>⚡</span>
                    <span>Quick Match</span>
                  </button>
                </div>

                {/* Game Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">4</div>
                    <div className="text-sm text-gray-600">Tigers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">20</div>
                    <div className="text-sm text-gray-600">Goats</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">∞</div>
                    <div className="text-sm text-gray-600">Strategy</div>
                  </div>
                </div>
              </div>

              {/* Board Image Side */}
              <div className="flex justify-center lg:justify-end overflow-hidden">
                <div className="relative max-w-full">
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -left-4 w-full h-full bg-gray-800 rounded-2xl transform rotate-3 hidden md:block"></div>
                  <div className="absolute -top-2 -left-2 w-full h-full bg-gray-600 rounded-2xl transform rotate-1 hidden md:block"></div>

                  {/* Main board container */}
                  <div className="relative w-[280px] md:w-[350px] lg:w-[400px] bg-white p-6 md:p-8 rounded-2xl shadow-2xl mx-auto">
                    <div className="relative">
                      <img
                        src={board}
                        alt="Traditional Bagh Chal board"
                        className="w-full h-full object-contain drop-shadow-lg"
                      />

                      {/* Floating labels */}
                      <div className="absolute -top-3 -right-3 bg-gray-800 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Traditional
                      </div>
                      <div className="absolute -bottom-3 -left-3 bg-white border-2 border-gray-800 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold">
                        Strategic
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Call to Action */}
            <div className="text-center mt-20">
              <p className="text-gray-500 text-lg">
                Ready to test your strategic mind?
              </p>
              <div className="mt-4 animate-bounce">
                <span className="text-2xl">🎲</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <GameModal
        mode={gameMode}
        isOpen={gameModalOpen}
        onClose={() => setGameModalOpen(false)}
      />
    </>
  );
};

export default Home;
