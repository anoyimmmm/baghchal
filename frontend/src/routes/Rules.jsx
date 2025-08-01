import board from "../assets/board.png";

const Rules = () => {
  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen overflow-x-hidden w-full">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Bagh Chal Rules
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the ancient art of strategic warfare between tigers and goats
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Game Overview */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Game Overview
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Bagh Chal (Tigers and Goats) is a traditional asymmetric
                  strategy game from Nepal. Two players compete with different
                  pieces and objectives, creating a unique and challenging
                  gameplay experience.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <div className="font-semibold text-gray-800">4 Tigers</div>
                    <div className="text-sm text-gray-600">Hunters</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <div className="font-semibold text-gray-800">20 Goats</div>
                    <div className="text-sm text-gray-600">Defenders</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center overflow-hidden">
                <div className="w-full max-w-80 bg-gray-100 p-6 rounded-lg border border-gray-200">
                  <img
                    src={board}
                    alt="Bagh Chal game board"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Setup */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Game Setup
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Initial Position
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>
                      4 tigers are placed at the four corner points of the board
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>
                      All 20 goats start off the board and will be placed during
                      gameplay
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-3 mt-1">•</span>
                    <span>The goat player goes first</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Gameplay Phases */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Gameplay Phases
            </h2>

            <div className="space-y-8">
              {/* Phase 1 */}
              <div className="border-l-4 border-gray-400 bg-gray-50 p-6 rounded-r-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Phase 1: Placement Phase
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg">
                    The first phase focuses on positioning. Goats enter the
                    battlefield one by one.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Goat Turn:
                      </h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Place one goat on any empty intersection</li>
                        <li>• Cannot move existing goats yet</li>
                        <li>• Try to limit tiger movement</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Tiger Turn:
                      </h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Move one tiger to adjacent empty point</li>
                        <li>• Can capture goats by jumping over them</li>
                        <li>• Focus on creating capture opportunities</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800">
                      This phase ends when all 20 goats have been placed on the
                      board
                    </p>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="border-l-4 border-gray-400 bg-gray-50 p-6 rounded-r-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Phase 2: Movement Phase
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg">
                    Now both tigers and goats can move freely. The real
                    strategic battle begins!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Goat Movement:
                      </h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Move one goat to adjacent empty intersection</li>
                        <li>• Work together to surround tigers</li>
                        <li>• Block tiger escape routes</li>
                        <li>• Protect vulnerable goats</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Tiger Movement:
                      </h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Move to adjacent empty point, OR</li>
                        <li>• Jump over adjacent goat to capture it</li>
                        <li>• Continue hunting for the 5th goat</li>
                        <li>• Avoid getting completely surrounded</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Movement Rules */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Movement Rules
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Tiger Movement
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Normal Move:
                      </h4>
                      <p className="text-gray-700">
                        Move to any adjacent empty intersection along the lines
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Capture Move:
                      </h4>
                      <p className="text-gray-700">
                        Jump over an adjacent goat to an empty point directly
                        behind it. The goat is captured and removed.
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded border border-gray-200">
                      <p className="text-gray-800 text-sm">
                        Tigers cannot jump over other tigers or jump to occupied
                        intersections
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Goat Movement
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-800">Movement:</h4>
                      <p className="text-gray-700">
                        Move to any adjacent empty intersection along the lines
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        No Capturing:
                      </h4>
                      <p className="text-gray-700">
                        Goats cannot capture tigers - they win through
                        positioning and blocking
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded border border-gray-200">
                      <p className="text-gray-800 text-sm">
                        Goats must work together to create effective blockades
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Board Layout
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    The board consists of 25 intersection points connected by
                    lines. Pieces can only move along these lines to adjacent
                    intersections.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                      <span>Corner points (tiger starting positions)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                      <span>Edge points</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-600 rounded-full mr-3"></div>
                      <span>Center and inner points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Victory Conditions */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Victory Conditions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Tigers Win
                </h3>
                <div className="space-y-4">
                  <p className="text-lg text-gray-800 font-medium">
                    Capture 5 goats
                  </p>
                  <p className="text-gray-700">
                    Tigers achieve victory by successfully capturing 5 goats
                    through jumping maneuvers. Each captured goat is permanently
                    removed from the board.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-sm">
                      <strong>Strategy:</strong> Focus on creating capture
                      opportunities and avoiding complete encirclement
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Goats Win
                </h3>
                <div className="space-y-4">
                  <p className="text-lg text-gray-800 font-medium">
                    Block all tiger movements
                  </p>
                  <p className="text-gray-700">
                    Goats win by positioning themselves so that no tiger can
                    make any legal move. This includes both normal moves and
                    capture moves.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-sm">
                      <strong>Strategy:</strong> Coordinate positioning to
                      create impenetrable barriers around tigers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategy Tips */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Strategy Tips
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Tiger Strategies
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Early Game
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Stay mobile and avoid clustering. Look for isolated goats
                      to capture.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">Mid Game</h4>
                    <p className="text-gray-700 text-sm">
                      Create threats from multiple directions. Force goats into
                      defensive positions.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Late Game
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Be patient and wait for goat mistakes. Maintain escape
                      routes.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Goat Strategies
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Placement Phase
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Control the center and limit tiger mobility. Avoid giving
                      easy captures.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Movement Phase
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Work as a team to create walls. Sacrifice position for
                      blocking if necessary.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">Endgame</h4>
                    <p className="text-gray-700 text-sm">
                      Tighten the noose gradually. Don't rush and leave escape
                      routes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Common Mistakes to Avoid
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Tiger Mistakes:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">✗</span>
                    <span>Moving tigers too close together</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">✗</span>
                    <span>Ignoring potential encirclement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">✗</span>
                    <span>Making hasty capture attempts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">✗</span>
                    <span>Getting trapped in corners</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Goat Mistakes:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">✗</span>
                    <span>Placing goats in easily captured positions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">✗</span>
                    <span>Not coordinating movements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">✗</span>
                    <span>Leaving gaps in defensive lines</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">✗</span>
                    <span>Being too aggressive early</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Rules;
