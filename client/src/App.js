import React, { useState, useEffect } from "react";
import { socket } from "./socket";

import { MainMenu } from "./components/MainMenu";
import { JoinRoom } from "./components/JoinRoom";
import { CreateRoom } from "./components/CreateRoom";
import { Lobby } from "./components/Lobby";
import { Minigame } from "./components/Minigame";
import { EndGame } from "./components/EndGame";
import { GradeParticle } from "./components/GradeParticle";
import { GameDone } from "./components/GameDone";

import wronganswer from "./sounds/wronganswer.mp3"
import rightanswer from "./sounds/rightanswer.mp3"
import hover from "./sounds/hover.mp3"
import click from "./sounds/click.mp3"

import './styles/App.scss';

function App() {
  const [ currentScreen, setCurrentScreen ] = useState("MainMenu");
  const [ roomInfo, setRoomInfo ] = useState();
  const [ playerName, setPlayerName ] = useState();
  const [ currentMinigame, setCurrentMinigame ] = useState();
  const [ scores, setScores ] = useState();
  const [ gameLength, setGameLength ] = useState(); 
  const [ error, setError ] = useState(null);

  const [ gradeParticles, setGradeParticles ] = useState({});
  const [ mouseMoveEvt, setMouseMoveEvt ] = useState({ x: 0, y: 0 });

  function onMouseMove(evt) {
    setMouseMoveEvt(evt)
  }

  function leaveRoom() {
    socket.emit("leaveRoom");
  }

  // pre-load audio files into browser cache
  useEffect(() => {
    new Audio(rightanswer);
    new Audio(wronganswer);
    new Audio(hover);
    new Audio(click);
  }, []);

  // handle WebSocket messages
  useEffect( () => {
    socket.on("error", params => {
      setCurrentScreen("MainMenu");
      setRoomInfo();
      setPlayerName();
      setCurrentMinigame();
      setScores();
      setGradeParticles({});
      setError(params.message);
    });

    socket.on("gameJoined", params => {
      setRoomInfo(params.roomInfo);
      setPlayerName(params.joinedPlayer);
      setCurrentScreen("Lobby");
    });

    socket.on("roomInfoChanged", params => {
      setRoomInfo(params.roomInfo);
    });

    socket.on("showMinigame", params => {
      setCurrentMinigame(params.minigame);
      setCurrentScreen("Minigame");
    });

    socket.on("setGameLength", params => {
      setGameLength(params.seconds);
    })

    socket.on("updateScores", params => {
      setScores(params.scores);
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
    });
  });

  /**
   * TODO: this displays an error as a browser alert, but
   * I want to make this a modal instead at some point
   */
  if (error != null) {
    alert(error);
    setError(null);
  }

  const screens = {
    "MainMenu":   <MainMenu
                    onJoinRoomClicked={ () => setCurrentScreen("JoinRoom") }
                    onCreateRoomClicked={ () => setCurrentScreen("CreateRoom") } />,
    "CreateRoom": <CreateRoom onBackClicked={ () => setCurrentScreen("MainMenu") } />,
    "JoinRoom":   <JoinRoom onBackClicked={ () => setCurrentScreen("MainMenu") } />,
    "Lobby":      <Lobby roomInfo={ roomInfo } currentPlayer={ playerName }
                    onBackClicked={ () => { setCurrentScreen("MainMenu"); leaveRoom() } }/>,
    "Minigame":   <Minigame minigame={ currentMinigame } gameSeconds={gameLength}
                    onPlayerDone={ () => { socket.emit("playerDone"); setCurrentScreen("GameDone") } }
                    scores={ scores } playerName={ playerName } />,
    "EndGame":    <EndGame scores={ scores } 
                    onPlayAgainClicked={ () => setCurrentScreen("Lobby") }
                    onBackClicked={ () => { setCurrentScreen("MainMenu"); leaveRoom() } }/>,
    "GameDone":   <GameDone />
  };

  return (
    <div onMouseMove={ onMouseMove } className="App">
      <header className="navbar">
        <h1>FREDBOX</h1>
      </header>
      <main>
        { screens[currentScreen] }
        {
          Object.values(gradeParticles).filter(prt => prt !== undefined).map(prt => {
            return (<GradeParticle key={ prt.key }
              gradeParticles={ gradeParticles } setGradeParticles={ setGradeParticles }
              points={ prt.points } left={ mouseMoveEvt.clientX } top={ mouseMoveEvt.clientY } />)
          })
        }
      </main>
    </div>
  );
}

export default App;
