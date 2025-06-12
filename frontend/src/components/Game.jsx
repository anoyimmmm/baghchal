import Board from "./Board";
const Game = () => {
  const handleMoveSend = (message) => {
    console.log(message);
    // const url = `ws://${window.location.host}/game`;
    // const socket = new WebSocket(url);
    // // open a websocket
    // socket.addEventListener("open", (event) => {
    //   socket.send(message);
    //   console.log("message sent");
    // });

    // socket.addEventListener("message", (event) => {
    //   console.log("Message from server ", event.data);
    // });
  };

  return (
    <>
      <Board onMoveSend={handleMoveSend} />
    </>
  );
};

export default Game;
