import { useState } from "react";
import { socket } from "../socket";

import { Button } from "./Button";

export function JoinRoom({ onBackClicked }) {
  const [ roomCode, setRoomCode ] = useState("");
  const [ playerName, setPlayerName ] = useState("");

  function updateRoomCode(evt) {
    setRoomCode(evt.target.value);
  }

  function updatePlayerName(evt) {
    setPlayerName(evt.target.value);
  }

  function joinRoom() {
    socket.emit("joinRoom", {
      "room": roomCode,
      "playerName": playerName
    });
  }

  return (
    <div>
      <div>
        <label className="form-label" htmlFor="player-name">Player name</label>
        <input className="form-control" onChange={ updatePlayerName } value={ playerName } name="player-name"></input>
      </div>

      <div>
        <label className="form-label" htmlFor="room-code">Room code</label>
        <input className="form-control" onChange={ updateRoomCode } value={ roomCode } name="room-code"></input>
      </div>

      <Button className="btn btn-primary" onClick={ joinRoom }>Join room</Button>

      <Button className="btn btn-back" onClick={ onBackClicked }>Back</Button>
    </div>
  )
}