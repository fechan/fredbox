import { useState } from "react";
import { socket } from "../socket";

export function JoinRoom() {
  const [ roomCode, setRoomCode ] = useState("ABCD");
  const [ playerName, setPlayerName ] = useState("ABCD");

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
        <label for="player-name">Player name</label>
        <input onChange={ updatePlayerName } value={ playerName } name="player-name"></input>
      </div>

      <div>
        <label for="room-code">Room code</label>
        <input onChange={ updateRoomCode } value={ roomCode } name="room-code"></input>
      </div>

      <button onClick={ joinRoom }>Join room</button>
    </div>
  )
}