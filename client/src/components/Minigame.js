import { MathMinigame } from "./minigames/MathMinigame";
import { OperatorMathMinigame } from "./minigames/OperatorMathMinigame";
import { StroopEffectMinigame } from "./minigames/StroopEffectMinigame";
import { UnscrambleMinigame } from "./minigames/UnscrambleMinigame";

export function Minigame({minigame}) {
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
      { minigames[minigame.name] }
    </div>
  )
}