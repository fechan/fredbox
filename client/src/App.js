import React, { useState, useEffect } from "react";
import { socket } from "./socket";

import { MainMenu } from "./components/MainMenu";
import { JoinRoom } from "./components/JoinRoom";
import { CreateRoom } from "./components/CreateRoom";
import { Lobby } from "./components/Lobby";
import { Minigame } from "./components/Minigame";
import { EndGame } from "./components/EndGame";
import { GradeParticle } from "./components/GradeParticle";

import './styles/App.scss';

function App() {
  const [ currentScreen, setCurrentScreen ] = useState("MainMenu");
  const [ roomInfo, setRoomInfo ] = useState();
  const [ playerName, setPlayerName ] = useState();
  const [ currentMinigame, setCurrentMinigame ] = useState();
  const [ scores, setScores ] = useState();

  const [ gradeParticles, setGradeParticles ] = useState({});
  const [ mouseMoveEvt, setMouseMoveEvt ] = useState({ x: 0, y: 0 });

  function onMouseMove(evt) {
    setMouseMoveEvt(evt)
  }

  useEffect( () => {
      socket.on("gameJoined", params => {
        setRoomInfo(params.roomInfo);
        setPlayerName(params.joinedPlayer);
        setCurrentScreen("Lobby");
      });

      socket.on("showMinigame", params => {
        setCurrentMinigame(params.minigame);
        setCurrentScreen("Minigame");
      });

      socket.on("endGame", params => {
        setScores(params.scores);
        setCurrentScreen("EndGame");
        setGradeParticles({});
      });

      socket.on("showGrade", params => {
        const gradeParticlesNew = { ...gradeParticles }
        gradeParticlesNew[Date.now()] = {
          key: Date.now(),
          points: params.points
        }
        setGradeParticles(gradeParticlesNew);
      })
    }
  );

  const screens = {
    "MainMenu": <MainMenu
                  onJoinRoomClicked={ () => setCurrentScreen("JoinRoom") }
                  onCreateRoomClicked={ () => setCurrentScreen("CreateRoom") }/>,
    "CreateRoom": <CreateRoom />,
    "JoinRoom": <JoinRoom />,
    "Lobby": <Lobby roomInfo={ roomInfo } currentPlayer={ playerName } />,
    "Minigame": <Minigame minigame={ currentMinigame } />,
    "EndGame": <EndGame scores={ scores } />
  };

  return (
    <div onMouseMove={ onMouseMove } className="App">
      <h1>Fredbox</h1>
      { screens[currentScreen] }

      {
        Object.values(gradeParticles).filter(prt => prt !== undefined).map(prt => {
          return (<GradeParticle key={ prt.key } keyName={ prt.key }
            gradeParticles={ gradeParticles } setGradeParticles={ setGradeParticles }
            points={ prt.points } left={ mouseMoveEvt.clientX } top={ mouseMoveEvt.clientY } />)
        })
      }
    </div>
  );
}

export default App;
