import { socket } from "../socket";

export function Lobby({ roomInfo, currentPlayer, onBackClicked }) {
  function startGame() {
    socket.emit("startGame");
  }

  const playerListItems = roomInfo.players.map(player =>
    <li className="list-group-item" key={ player.name }>
      { player.name }
      { roomInfo.host === player.name ? <span className="badge bg-primary ms-1">Host</span> : null}
    </li>
  );

  return (
    <div>
      <h2>Lobby: { roomInfo.roomCode }</h2>
      <ul className="list-group">{ playerListItems }</ul>

      {
        currentPlayer === roomInfo.host ?
          <button className="btn btn-primary" onClick={ startGame }>Start game</button> :
          "Waiting for host to start the game..."
      }

      <button className="btn btn-back" onClick={ onBackClicked }>Leave game</button>
    </div>
  )
}