import { useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import { socket } from "../socket";

import { GameStartCountdown } from "./GameStartCountdown";
import { MathMinigame } from "./minigames/MathMinigame";
import { OperatorMathMinigame } from "./minigames/OperatorMathMinigame";
import { StroopEffectMinigame } from "./minigames/StroopEffectMinigame";
import { UnscrambleMinigame } from "./minigames/UnscrambleMinigame";

export function Minigame({ minigame, gameSeconds, onPlayerDone }) {
  const [showGameStartCountdown, setShowGameStartCountdown] = useState(minigame.id === 0);

  const gameExpireTime = new Date();
  gameExpireTime.setSeconds(gameExpireTime.getSeconds() + gameSeconds);
  const gameTimer = useTimer({ expiryTimestamp: gameExpireTime, onExpire: onPlayerDone, autoStart: true });

  const minigames = {
    "MathMinigame": <MathMinigame minigameID={ minigame.id }
                                  question={ minigame.question }
                                  choices={ minigame.choices } />,
    "OperatorMathMinigame": <OperatorMathMinigame minigameID={ minigame.id }
                                                  question={ minigame.question }
                                                  choices={ minigame.choices } />,
    "StroopEffectMinigame": <StroopEffectMinigame minigameID={ minigame.id }
                                                  playerShouldSelect={ minigame.playerShouldSelect }
                                                  correctColor={ minigame.correctColor }
                                                  choices={ minigame.choices } />,
    "UnscrambleMinigame": <UnscrambleMinigame minigameID={ minigame.id }
                                              choices={ minigame.choices } />
  };

  return (
    <div>
      {!showGameStartCountdown &&
        <header>
          <span className="text-muted">TIME LEFT</span> <span className="h3">{ gameTimer.totalSeconds }</span>
          <hr></hr>
        </header>
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