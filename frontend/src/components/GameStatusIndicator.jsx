import { useEffect, useRef } from "react";

const GameStatusIndicator = ({ gameState, moveHistory }) => {
  const historyContainerRef = useRef(null);

  useEffect(() => {
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop =
        historyContainerRef.current.scrollHeight;
    }
  }, [moveHistory]);

  return (
    <div className="h-32 lg:h-full flex flex-col p-3 lg:p-4 font-sans bg-[#262522] text-gray-200 overflow-auto">
      {/* Game Statistics */}
      <div className="mb-4 lg:mb-6 flex-shrink-0">
        <h3 className="text-xs lg:text-sm font-semibold uppercase tracking-wider mb-2 lg:mb-3 text-gray-400">
          Game Statistics
        </h3>

        <div className="space-y-2 lg:space-y-3">
          <div className="flex justify-between items-center py-1.5 lg:py-2 px-2 bg-[#2f2d2a] rounded-xl border border-[#3a3835]">
            <span className="text-xs lg:text-sm font-medium text-gray-300">
              Goats Remaining
            </span>
            <span className="font-extrabold text-sm lg:text-base text-green-400">
              {gameState?.unusedGoat || 0}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 lg:py-2 px-2 bg-[#2f2d2a] rounded-xl border border-[#3a3835]">
            <span className="text-xs lg:text-sm font-medium text-gray-300">
              Goats Captured
            </span>
            <span className="font-extrabold text-sm lg:text-base text-red-400">
              {gameState?.deadGoatCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Move History */}
      <div className="mb-4 lg:mb-6 flex flex-col flex-1 min-h-0">
        <h3 className="text-xs lg:text-sm font-semibold uppercase tracking-wider mb-2 lg:mb-3 text-gray-400">
          Move History
        </h3>

        <div className="flex-1 flex flex-col min-h-10 bg-[#1e1911] rounded-xl border border-[#3a3835] overflow-hidden">
          {!moveHistory || moveHistory.length === 0 ? (
            <div className="flex-1 flex items-center justify-center min-h-0">
              <p className="text-gray-500 text-xs lg:text-sm">No moves yet</p>
            </div>
          ) : (
            <div
              ref={historyContainerRef}
              className="flex-1 overflow-y-auto space-y-2 min-h-0 p-2"
            >
              {moveHistory.map((move, index) => (
                <div
                  key={index}
                  className="px-2 py-1 lg:py-2 bg-[#262522] rounded-lg border border-[#3a3835] text-xs lg:text-sm text-gray-200"
                >
                  <span className="text-gray-500 mr-2">{index + 1}.</span>
                  <span>{move}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStatusIndicator;
