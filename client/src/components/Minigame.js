import { useState } from "react";
import { useTimer } from "react-timer-hook";

import { GameStartCountdown } from "./GameStartCountdown";
import { MathMinigame } from "./minigames/MathMinigame";
import { OperatorMathMinigame } from "./minigames/OperatorMathMinigame";
import { StroopEffectMinigame } from "./minigames/StroopEffectMinigame";
import { UnscrambleMinigame } from "./minigames/UnscrambleMinigame";
import { DialMinigame } from "./minigames/DialMinigame";
import { TomSpatialVisualization } from "./minigames/TomSpatialVisualization";

export function Minigame({ minigame, gameSeconds, onPlayerDone, scores, playerName }) {
  const [showGameStartCountdown, setShowGameStartCountdown] = useState(minigame.id === 0);

  const gameExpireTime = new Date();
  gameExpireTime.setSeconds(gameExpireTime.getSeconds() + gameSeconds);
  const gameTimer = useTimer({ expiryTimestamp: gameExpireTime, onExpire: onPlayerDone, autoStart: true });

  const minigames = {
    "MathMinigame": <MathMinigame key={ minigame.id }
      minigameID={ minigame.id }
      question={ minigame.question }
      choices={ minigame.choices } />,

    "OperatorMathMinigame": <OperatorMathMinigame key={ minigame.id }
      minigameID={ minigame.id }
      question={ minigame.question }
      choices={ minigame.choices } />,

    "StroopEffectMinigame": <StroopEffectMinigame key={ minigame.id }
      minigameID={ minigame.id }
      playerShouldSelect={ minigame.playerShouldSelect }
      correctColor={ minigame.correctColor }
      choices={ minigame.choices } />,

    "UnscrambleMinigame": <UnscrambleMinigame key={ minigame.id }
      minigameID={ minigame.id }
      choices={ minigame.choices } />,

    "DialMinigame": <DialMinigame key={ minigame.id }
      minigameID={ minigame.id }
      choices={ minigame.choices }
      dialWord={ minigame.dialWord } />,

    "TomSpatialVisualization": <TomSpatialVisualization
      minigameID={ minigame.id }
      choices={ minigame.choices }
      shape={ minigame.shape }
      boxes={ minigame.boxes } />,
  };

  function getPlayerPosition() {
    let playerAhead = "nobody";
    if (!scores) return {place: 1, points: 0, playerAhead: playerAhead};

    for (let i = 0; i < scores.length; i++) {
      let playerNameAtPlace = scores[i].playerName;
      if (playerNameAtPlace === playerName) {
        return {place: i + 1, points: scores[i].score, playerAhead: playerAhead};
      }
      playerAhead = playerNameAtPlace;
    }
  }
  const {place, points, playerAhead} = getPlayerPosition();

  return (
    <div className="Minigame">
      {!showGameStartCountdown && <>
        <header className="stats">
          <div><span className="stat-label">TIME&nbsp;LEFT</span> <span className="stat-value">{ gameTimer.totalSeconds }</span></div>
          <div><span className="stat-label">POINTS</span>    <span className="stat-value">{ points }</span></div>
          <div><span className="stat-label">POSITION</span>  <span className="stat-value">{ place }</span></div>
        </header>
        <hr></hr>
        </>
      }

      <main>
        { showGameStartCountdown ?
          <GameStartCountdown seconds={3} onCountdownEnded={() => setShowGameStartCountdown(false)} /> :
          minigames[minigame.name]
        }
      </main>
    </div>
  )
}