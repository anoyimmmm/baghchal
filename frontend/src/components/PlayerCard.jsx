const PlayerCard = ({
  isUserCard,
  username,
  goatPlayer,
  tigerPlayer,
  currentPlayer,
}) => {
  // Determine which player this card represents
  let player = "";
  let cardName = "";

  if (isUserCard) {
    // This is the current user's card
    player = username === goatPlayer ? "goat" : "tiger";
    cardName = username;
  } else {
    // This is the opponent's card
    if (username === goatPlayer) {
      player = "tiger";
      cardName = tigerPlayer;
    } else {
      player = "goat";
      cardName = goatPlayer;
    }
  }

  const isCurrentTurn = currentPlayer === player;

  return (
    <div
      className={`flex items-center justify-between px-2 py-1 rounded-xl border-2 transition-all max-w-sm mx-auto w-full font-sans shadow-sm ${
        isCurrentTurn
          ? "border-gray-800 bg-gray-800 text-white shadow-lg"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isCurrentTurn ? "bg-white" : "bg-gray-800"
          }`}
        >
          <span
            className={`text-xs font-bold uppercase ${
              isCurrentTurn ? "text-gray-800" : "text-white"
            }`}
          >
            {player.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <div
            className={`font-bold text-sm sm:text-base truncate ${
              isCurrentTurn ? "text-white" : "text-gray-800"
            }`}
          >
            {cardName}
          </div>
          <div
            className={`text-xs sm:text-sm capitalize font-light ${
              isCurrentTurn ? "text-gray-200" : "text-gray-600"
            }`}
          >
            {player}
          </div>
        </div>
      </div>

      {isCurrentTurn && cardName === username && (
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-gray-200 uppercase tracking-wider font-semibold">
            Your Turn
          </div>
          <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse ml-auto"></div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
