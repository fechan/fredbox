import { socket } from "../socket";

export function Lobby({ roomInfo, currentPlayer, onBackClicked }) {
  function startGame() {
    socket.emit("startGame");
  }

  const playerListItems = roomInfo.players.map(player =>
    <li className="list-group-item h4 border-0 pb-0" key={ player.name }>
      { (roomInfo.host === player.name) && <span className="badge bg-primary me-1">Host</span> }
      { player.name }
    </li>
  );

  return (
    <div>
      <h2>Room code: { roomInfo.roomCode }</h2>
      <hr />

      <ul className="list-group">
        { playerListItems }
      </ul>
      <hr />

      {
        currentPlayer === roomInfo.host ?
          <button className="btn btn-primary" onClick={ startGame }>Start game</button> :
          "Waiting for host to start the game..."
      }

      <button className="btn btn-back" onClick={ onBackClicked }>Leave game</button>
    </div>
  )
}