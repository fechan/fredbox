import { useState } from "react";
import { socket } from "../socket";

export function CreateRoom() {
  const [ playerName, setPlayerName ] = useState();

  function updatePlayerName(evt) {
    setPlayerName(evt.target.value);
  }

  function createRoom() {
    socket.emit("createRoom", { "hostPlayerName": playerName });
  }

  return (
    <div>
      <div>
        <label class="form-label" for="player-name">Player name</label>
        <input class="form-control" onChange={ updatePlayerName } value={ playerName } name="player-name"></input>
      </div>

      <button class="btn btn-primary" onClick={ createRoom }>Start game</button>
    </div>
  )
}