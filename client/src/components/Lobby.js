import { socket } from "../socket";

export function Lobby({ roomInfo, currentPlayer }) {
  function startGame() {
    socket.emit("startGame");
  }

  const playerListItems = roomInfo.players.map(player =>
    <li class="list-group-item" key={ player.name }>
      { player.name }
      { roomInfo.host === player.name ? <span class="badge bg-primary ms-1">Host</span> : null}
    </li>
  );

  return (
    <div>
      <h2>Lobby: { roomInfo.roomCode }</h2>
      <ul class="list-group">{ playerListItems }</ul>

      {
        currentPlayer === roomInfo.host ?
          <button class="btn btn-primary" onClick={ startGame }>Start game</button> :
          "Waiting for host to start the game..."
      }
    </div>
  )
}