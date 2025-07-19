import Board from "./Board";
const Game = () => {
  const handleMoveSend = (message) => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    console.log(wsUrl);
    const socket = new WebSocket(wsUrl);
    // open a websocket
    socket.addEventListener("open", (event) => {
      socket.send(JSON.stringify({ message: message }));
    });

    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
    });
  };

  return (
    <>
      <Board onMoveSend={handleMoveSend} />
    </>
  );
};

export default Game;
