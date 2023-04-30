import { DummyMinigame } from "./minigames/DummyMinigame";
import { MathMinigame } from "./minigames/MathMinigame";
import { StroopEffectMinigame } from "./minigames/StroopEffectMinigame";

export function Minigame({minigame}) {
  const minigames = {
    "DummyMinigame": <DummyMinigame choices={ minigame.choices } />,
    "MathMinigame": <MathMinigame question={ minigame.question } choices={ minigame.choices } />,
    "StroopEffectMinigame": <StroopEffectMinigame playerShouldSelect={ minigame.playerShouldSelect }
                                                  correctColor={ minigame.correctColor }
                                                  choices={ minigame.choices }/>
  };

  return (
    <div>
      <h2>Minigame: { minigame.name }</h2>
      { minigames[minigame.name] }
    </div>
  )
}