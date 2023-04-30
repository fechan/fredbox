import { useState } from "react";
import { socket } from "../socket";

export function JoinRoom() {
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
    })
  }

  return (
    <div>
      <div>
        <label class="form-label" for="player-name">Player name</label>
        <input class="form-control" onChange={ updatePlayerName } value={ playerName } name="player-name"></input>
      </div>

      <div>
        <label class="form-label" for="room-code">Room code</label>
        <input class="form-control" onChange={ updateRoomCode } value={ roomCode } name="room-code"></input>
      </div>

      <button class="btn btn-primary" onClick={ joinRoom }>Join room</button>
    </div>
  )
}