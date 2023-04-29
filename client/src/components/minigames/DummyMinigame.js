import { socket } from "../../socket";

export function DummyMinigame({choices}) {
  function setAnswer(evt) {
    socket.emit("gradeAnswer", {
      "answer": evt.target.value
    });
  }

  return (
    <div>
      {
        choices.map(choice => (
          <button value={ choice } onClick={ setAnswer }>{ choice }</button>
        ))
      }
    </div>
  )
}