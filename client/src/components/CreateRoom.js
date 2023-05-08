import { useState } from "react";
import { socket } from "../socket";

export function CreateRoom() {
  const [ playerName, setPlayerName ] = useState("");

  function updatePlayerName(evt) {
    setPlayerName(evt.target.value);
  }

  function createRoom() {
    socket.emit("createRoom", { "hostPlayerName": playerName });
  }

  return (
    <div>
      <div>
        <label className="form-label" htmlFor="player-name">Player name</label>
        <input className="form-control" onChange={ updatePlayerName } value={ playerName } name="player-name"></input>
      </div>

      <button className="btn btn-primary" onClick={ createRoom }>Start game</button>
    </div>
  )
}