import React, { useState, useEffect } from "react";
import { socket } from "./socket";

import { MainMenu } from "./components/MainMenu";
import { JoinRoom } from "./components/JoinRoom";
import { CreateRoom } from "./components/CreateRoom";
import { Lobby } from "./components/Lobby";
import { Minigame } from "./components/Minigame";
import { EndGame } from "./components/EndGame";

import './App.css';

function App() {
  const [ currentScreen, setCurrentScreen ] = useState("MainMenu");
  const [ roomCode, setRoomCode ] = useState();
  const [ currentMinigame, setCurrentMinigame ] = useState();
  const [ scores, setScores ] = useState();

  useEffect( () => {
      socket.on("gameJoined", params => {
        setRoomCode(params.roomCode);
        setCurrentScreen("Lobby");
      });

      socket.on("showMinigame", params => {
        setCurrentMinigame(params.minigame);
        setCurrentScreen("Minigame");
      });

      socket.on("endGame", params => {
        setScores(params.scores);
        setCurrentScreen("EndGame");
      });
    }
  );

  const screens = {
    "MainMenu": <MainMenu
                  onJoinRoomClicked={ () => setCurrentScreen("JoinRoom") }
                  onCreateRoomClicked={ () => setCurrentScreen("CreateRoom") }/>,
    "CreateRoom": <CreateRoom />,
    "JoinRoom": <JoinRoom />,
    "Lobby": <Lobby roomCode={ roomCode }/>,
    "Minigame": <Minigame minigame={ currentMinigame } />,
    "EndGame": <EndGame scores={ scores } />
  };

  return (
    <div>
      <h1>Fredbox</h1>
      { screens[currentScreen] }
    </div>
  );
}

export default App;
