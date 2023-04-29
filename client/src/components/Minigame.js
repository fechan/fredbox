import { DummyMinigame } from "./minigames/DummyMinigame";
import { MathMinigame } from "./minigames/MathMinigame";

export function Minigame({minigame}) {
  const minigames = {
    "DummyMinigame": <DummyMinigame choices={ minigame.choices } />,
    "MathMinigame": <MathMinigame question={ minigame.question } choices={ minigame.choices } />
  };

  return (
    <div>
      <h2>Minigame: { minigame.name }</h2>
      { minigames[minigame.name] }
    </div>
  )
}