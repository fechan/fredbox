import { socket } from "../../socket";

export function MathMinigame({question, choices}) {
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
            <button key={ i } className="choice" value={ choice } onClick={ setAnswer }>{ choice }</button>
          ))
        }
      </div>
    </div>
  )
}