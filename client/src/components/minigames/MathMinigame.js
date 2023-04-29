import { socket } from "../../socket";

export function MathMinigame({question, choices}) {
  function setAnswer(evt) {
    socket.emit("gradeAnswer", {
      "answer": evt.target.value
    });
  }

  return (
    <div>
      <p>{ question }</p>
      {
        choices.map(choice => (
          <button value={ choice } onClick={ setAnswer }>{ choice }</button>
        ))
      }
    </div>
  )
}