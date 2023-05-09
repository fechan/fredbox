import { socket } from "../../socket";

export function StroopEffectMinigame({playerShouldSelect, correctColor, choices}) {
  function setAnswer(evt) {
    socket.emit("gradeAnswer", {
      "answer": choices[parseInt(evt.target.value)]
    });
  }

  const choiceListItems = choices.map((choice, choiceIdx) =>
    <button key={ choiceIdx } className="choice" style={{color: choice.textColor}}
        value={choiceIdx} onClick={ setAnswer }>
      { choice.word }
    </button>
  );

  const question = playerShouldSelect === "word" ?
    <>Select a word that <strong>says <span style={{color: correctColor}}>{ correctColor }</span></strong></> :
    <>Select a word <strong>written in <span style={{color: correctColor}}>{ correctColor }</span></strong></>;

  return (
    <div className="StroopEffectMinigame">
      <p className="h2">{ question }</p>
      { choiceListItems }
    </div>
  )
}