import { socket } from "../../socket";

export function OperatorMathMinigame({ minigameID, question, choices }) {
  function setAnswer(evt) {
    socket.emit("gradeAnswer", {
      "answer": evt.target.value
    });
  }

  return (
    <div class="OperatorMathMinigame">
      <p className="question">{ question }</p>
      <div class="choice-container">
        {
          choices.map((choice, i) => (
            <button key={ String(minigameID) + i } className="choice" value={ choice } onClick={ setAnswer }>{ choice }</button>
          ))
        }
      </div>
    </div>
  );
}