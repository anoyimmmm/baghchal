import { createContext, useContext, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const initialGameState = {
  board: {
    "0-0": "tiger",
    "0-4": "tiger",
    "4-0": "tiger",
    "4-4": "tiger",
  },
  currentPlayer: "goat",
  phase: "placement",
  unusedGoat: 20,
  deadGoatCount: 0,
  status: "waiting",
  winner: null,
  newPosition: "",
  previousPosition: "",
  player: {
    goat: "",
    tiger: "",
  },
};

export const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);
const baseSocketUrl = import.meta.env.VITE_BASE_WS_URL;
console.log("baseSocketUrl: ", baseSocketUrl);

export const WebSocketProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [gameState, setGameState] = useState(initialGameState);
  const [isConnected, setIsConnected] = useState(false);

  // connect to the server websocket
  const connect = (gameId = "", mode = "", playAs = "") => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    const params = new URLSearchParams({
      game_id: gameId,
      mode: mode,
      play_as: playAs,
      //TODO: add guestID if username doesn't exist
      username: auth.user?.username || auth.guestId,
    });
    const wsUrl = `${baseSocketUrl}?${params}`;
    console.log("wsUrl: ", wsUrl);

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      setIsConnected(true);
      console.log("websocket connected");
    };

    // update and locate to game on new gameState
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newGameState = data.message?.game_state;
      if (newGameState) {
        setGameState(newGameState);
        if (!window.location.pathname.includes("/game/")) {
          navigate(`/game/${newGameState.game_id}`);
        }
      }
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket closed");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };
  };

  const send = (message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.warn("WebSocket is not connected. Cannot send message:", message);
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
  };

  return (
    <WebSocketContext.Provider
      value={{
        connect,
        send,
        disconnect,
        gameState,
        isConnected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
