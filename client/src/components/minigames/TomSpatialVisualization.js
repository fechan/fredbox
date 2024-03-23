import { socket } from "../../socket";

const MIRROR_CSS_TRANSFORMS = {
  "none": "",
  "horizontal": "scaleX(-1)",
  "vertical": "scaleY(-1)"
};

export function TomSpatialVisualization({ minigameID, shape, boxes, choices }) {
  console.log(boxes);

  function setAnswer(evt) {
    socket.emit("gradeAnswer", {
      "answer": evt.target.value
    });
  }

  function Box(box, boxNbr) {
    const topTransform = `rotate(${box.topRotation}deg) ${MIRROR_CSS_TRANSFORMS[box.topMirror]}`;
    const bottomTransform = `rotate(${box.bottomRotation}deg) ${MIRROR_CSS_TRANSFORMS[box.bottomMirror]}`;
    return (
      <div className="TSVBox" key={ `${minigameID}-box-${boxNbr}` }>
        <div style={ { transform: topTransform } }>{ shape }</div>
        <div style={ { transform: bottomTransform } }>{ shape }</div>
      </div>
    )
  }

  function Choice(choice, choiceNbr) {
    return (
      <button key={ `${minigameID}-choice-${choiceNbr}` }
        className="choice"
        value={ choice }
        onClick={ setAnswer }>
          { choice }
      </button>
    );
  }

  return (
    <div className="TomSpatialVisualization">
      <p className="question">How many boxes are there where the bottom shape is a rotated but NOT mirrored version of the top shape?</p>

      <div className="box-container">{ boxes.map(Box) }</div>

      <div className="choice-container">{ choices.map(Choice) }</div>
    </div>
  )
}