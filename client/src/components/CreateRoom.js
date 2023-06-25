import { useState } from "react";
import { socket } from "../socket";

import { Button } from "./Button";

export function CreateRoom({ onBackClicked }) {
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

      <Button className="btn btn-primary" onClick={ createRoom }>Start game</Button>

      <Button className="btn btn-back" onClick={ onBackClicked }>Back</Button>
    </div>
  )
}