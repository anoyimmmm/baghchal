import { createContext, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [gameState, setGameState] = useState();

  const connect = (url) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    socketRef.current = new WebSocket(url);
    socketRef.current.onopen = () => {
      console.log("websocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newGameState = data.message?.game_state;
      if (newGameState) {
        setGameState(newGameState);
        navigate("/game");
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
    };
  };

  const send = (message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  return (
    <WebSocketContext value={{ connect, send, gameState }}>
      {children}
    </WebSocketContext>
  );
};
