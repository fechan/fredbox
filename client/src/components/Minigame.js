import { useState } from "react";
import { GameStartCountdown } from "./GameStartCountdown";
import { MathMinigame } from "./minigames/MathMinigame";
import { OperatorMathMinigame } from "./minigames/OperatorMathMinigame";
import { StroopEffectMinigame } from "./minigames/StroopEffectMinigame";
import { UnscrambleMinigame } from "./minigames/UnscrambleMinigame";

export function Minigame({minigame}) {
  const [showCountdown, setShowCountdown] = useState(minigame.id === 0);

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
      { showCountdown ? 
        <GameStartCountdown seconds={3} onCountdownEnded={() => setShowCountdown(false)} /> :
        minigames[minigame.name]
      }
    </div>
  )
}