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
    <div className="h-32 lg:h-full flex flex-col p-3 lg:p-4 font-sans overflow-y-auto">
      {/* Current Turn */}
      <div className="mb-4 lg:mb-6 flex-shrink-0">
        <h3 className="text-xs lg:text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
          Current Turn
        </h3>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-2 lg:p-3 border border-gray-200 shadow-sm">
          <div className="text-sm lg:text-lg font-bold text-gray-800">
            {getCurrentTurnDisplay()}
          </div>
        </div>
      </div>

      <div className="mb-4 lg:mb-6 flex-shrink-0 ">
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
