import { socket } from "../socket";

export function Lobby({ roomInfo, currentPlayer }) {
  function startGame() {
    socket.emit("startGame");
  }

  const playerListItems = roomInfo.players.map(player =>
    <li key={ player.name }>
      { player.name }
      { roomInfo.host === player.name ? "(HOST)" : ""}
    </li>
  );

  return (
    <div>
      <h2>Lobby: { roomInfo.roomCode }</h2>
      <ul>{ playerListItems }</ul>
      { currentPlayer === roomInfo.host ? <button onClick={ startGame }>Start game</button> : "Waiting for host to start the game..." }
    </div>
  )
}