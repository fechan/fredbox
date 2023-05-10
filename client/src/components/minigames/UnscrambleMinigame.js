import { useEffect, useState } from "react";
import { socket } from "../../socket";

export function UnscrambleMinigame({ minigameID, choices }) {
  const [ intermedAnswer, setIntermedAnswer ] = useState("");
  const [ remainingChoices, setRemainingChoices ] = useState([]);

  useEffect(() => {
    setRemainingChoices(choices);
    setIntermedAnswer("");
  }, [choices]);

  function addToAnswer(evt) {
    const letter = evt.target.value;
    if (intermedAnswer.length + 1 === 4) {
      setAnswer(intermedAnswer + letter);
    }
    setIntermedAnswer(intermedAnswer + letter);

    // remove the selected choice from remaining choices
    let newRemainingChoices = [...remainingChoices];
    const indexOfChoice = newRemainingChoices.findIndex(choice => choice === letter);
    newRemainingChoices.splice(indexOfChoice, 1);
    setRemainingChoices(newRemainingChoices);
  }

  function setAnswer(answer) {
    socket.emit("gradeAnswer", {
      "answer": answer
    });
  }

  return (
    <div className="UnscrambleMinigame">
      <div className="choice-container">
        {
          remainingChoices.map((letter, i) => 
            <button key={ String(minigameID) + i } onClick={ addToAnswer } value={ letter }>{ letter }</button>
          )
        }
      </div>
      <div>{ intermedAnswer }</div>
    </div>
  );
}