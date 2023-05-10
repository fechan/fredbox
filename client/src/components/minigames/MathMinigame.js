import { socket } from "../../socket";

export function MathMinigame({minigameID, question, choices}) {
  function setAnswer(evt) {
    socket.emit("gradeAnswer", {
      "answer": evt.target.value
    });
  }

  return (
    <div className="MathMinigame">
      <p className="question">{ question }</p>
      <div className="choice-container">
        {
          choices.map((choice, i) => (
            <button key={ String(minigameID) + i } className="choice" value={ choice } onClick={ setAnswer }>{ choice }</button>
          ))
        }
      </div>
    </div>
  )
}