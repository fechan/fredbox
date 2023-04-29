import { useState } from "react";
import { socket } from "../socket";

export function Lobby({roomCode}) {
  function startGame() {
    socket.emit("startGame");
  }

  return (
    <div>
      <h2>Lobby: { roomCode }</h2>
      <button onClick={ startGame }>Start game</button>
    </div>
  )
}