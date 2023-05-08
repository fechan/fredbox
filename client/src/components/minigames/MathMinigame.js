import { socket } from "../../socket";

export function MathMinigame({question, choices}) {
  function setAnswer(evt) {
    socket.emit("gradeAnswer", {
      "answer": evt.target.value
    });
  }

  return (
    <div>
      <p className="h2">{ question }</p>
      {
        choices.map((choice, i) => (
          <button key={ i } className="btn btn-primary" value={ choice } onClick={ setAnswer }>{ choice }</button>
        ))
      }
    </div>
  )
}