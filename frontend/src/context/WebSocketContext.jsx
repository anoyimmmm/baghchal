import { createContext, useContext, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

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
};

export const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [gameState, setGameState] = useState(initialGameState);
  const [isConnected, setIsConnected] = useState(false);

  const connect = (url) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      setIsConnected(true);
      console.log("websocket connected");
    };

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

  const reconnect = () => {
    console.log("trying to reconnect");
    const { gameId } = useParams();

    const newGameId = gameId.replace("game_", "");
    const params = new URLSearchParams({
      game_id: newGameId,
    });

    const wsUrl = `ws://localhost:8000/ws/game/?${params}`;
    connect(wsUrl);
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
        reconnect,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
