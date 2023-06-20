import { useState, useEffect } from "react";
import { socket } from "../socket";

import { GameStartCountdown } from "./GameStartCountdown";
import { MathMinigame } from "./minigames/MathMinigame";
import { OperatorMathMinigame } from "./minigames/OperatorMathMinigame";
import { StroopEffectMinigame } from "./minigames/StroopEffectMinigame";
import { UnscrambleMinigame } from "./minigames/UnscrambleMinigame";

export function Minigame({ minigame, gameSeconds, onPlayerDone }) {
  const [showGameStartCountdown, setShowGameStartCountdown] = useState(minigame.id === 0);
  const [gameTimeLeft, setGameTimeLeft] = useState(gameSeconds);

  useEffect( () => {
    const timeout = setTimeout(() => {
      setGameTimeLeft(gameTimeLeft - .1);
      if (gameTimeLeft <= .5) {        
        socket.emit("playerDone");
        onPlayerDone();
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [gameTimeLeft, onPlayerDone]);

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
      <span>{ gameTimeLeft }</span>
      { showGameStartCountdown ? 
        <GameStartCountdown seconds={3} onCountdownEnded={() => setShowGameStartCountdown(false)} /> :
        minigames[minigame.name]
      }
    </div>
  )
}