import { useState, useEffect } from "react";
import { socket } from "../../socket";

export function DialMinigame({ minigameID, dialWord, choices }) {
  const [ intermedAnswer, setIntermedAnswer ] = useState("");

  useEffect(() => {
    setIntermedAnswer("");
  }, [setIntermedAnswer]);

  function addToAnswer(number) {
    if (intermedAnswer.length + 1 === 4) {
      setAnswer(intermedAnswer + number);
    }
    setIntermedAnswer(intermedAnswer + number);
  }

  function resetAnswer() {
    setIntermedAnswer("");
  }

  function setAnswer(answer) {
    socket.emit("gradeAnswer", {
      "answer": answer
    });
  }

  return (
    <div className="DialMinigame">
      <h2>Dial { dialWord.toUpperCase() }</h2>
      <div className="dial-display">
        <span class="phone-icon">📞</span>
        <span class="dialed-number">{intermedAnswer}</span>
      </div>

      <div className="choice-container">
        {
          choices.map((choice, i) => (
            <button key={ String(minigameID) + i } className="choice" value={ choice } onClick={ () => addToAnswer(choice.number) }>
              <span className="number">{ choice.number }</span>
              <span className="letters">{ choice.letters }</span>
            </button>
          ))
        }
      </div>
      <button onClick={ resetAnswer } className="btn btn-outline-danger">Reset</button>
    </div>
  );

}
