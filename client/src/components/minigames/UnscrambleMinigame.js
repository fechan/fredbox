import { useEffect, useState } from "react";
import { socket } from "../../socket";

export function UnscrambleMinigame({ minigameID, choices }) {
  const [ intermedAnswer, setIntermedAnswer ] = useState("");
  const [ remainingChoices, setRemainingChoices ] = useState([]);
  const [ date, setDate ] = useState(Date.now());

  useEffect(() => {
    setRemainingChoices(choices);
    setIntermedAnswer("");
  }, [choices]);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(Date.now());
    }, 1000 / 144);

    return () => clearInterval(intervalId);
  }, [date]);

  function addToAnswer(letter, index) {
    if (intermedAnswer.length + 1 === 4) {
      setAnswer(intermedAnswer + letter);
    }
    setIntermedAnswer(intermedAnswer + letter);

    // remove the selected choice from remaining choices
    let newRemainingChoices = [...remainingChoices];
    newRemainingChoices[index] = "";
    setRemainingChoices(newRemainingChoices);
  }

  function resetAnswer() {
    setIntermedAnswer("");
    setRemainingChoices(choices);
  }

  function setAnswer(answer) {
    socket.emit("gradeAnswer", {
      "answer": answer
    });
  }

  const ms_per_min = 60000;
  const RPM = 5;
  const ms_per_rot = ms_per_min / RPM;
  const globalAngle = (date / ms_per_rot) * 2 * Math.PI;

  let intermedAnswerDisplay = "";
  for (let i=0; i < 4; i++) {
    if (i < intermedAnswer.length) {
      intermedAnswerDisplay += intermedAnswer.charAt(i) + " ";
    } else {
      intermedAnswerDisplay += "_ ";
    }
  }
  
  return (
    <div className="UnscrambleMinigame">
      <h2>Tap the letters in order to unscramble the word!</h2>
      <div className="choice-container">
        {
          remainingChoices.map((letter, i) => {
            const angle = globalAngle + (i * Math.PI / 2);
            const y = Math.sin(angle);
            const x = Math.cos(angle);
            const style = {
              transform: `translateX(calc(${x} * 250px / 2)) translateY(calc(${y} * 250px / 2))`
            }
      
            return (
              <button style={ style }
                  className="choice"
                  key={ String(minigameID) + i }
                  onClick={ () => addToAnswer(letter, i) }>
                { letter }
              </button>
            )
          })
        }
      </div>
      <div className="intermediate-answer">{ intermedAnswerDisplay }</div>
      <button onClick={ resetAnswer } className="btn btn-outline-danger">Reset</button>
    </div>
  );
}