import { useState } from "react";
import { socket } from "../socket";

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
        <label className="form-label" for="player-name">Player name</label>
        <input className="form-control" onChange={ updatePlayerName } value={ playerName } name="player-name"></input>
      </div>

      <div>
        <label className="form-label" for="room-code">Room code</label>
        <input className="form-control" onChange={ updateRoomCode } value={ roomCode } name="room-code"></input>
      </div>

      <button className="btn btn-primary" onClick={ joinRoom }>Join room</button>

      <button className="btn btn-back" onClick={ onBackClicked }>Back</button>
    </div>
  )
}