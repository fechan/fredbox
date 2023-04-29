const RandomUtils = require("../../utils/random");

OPERAND_MIN = -20;
OPERAND_MAX = 20;
RESULT_RANGE = (OPERAND_MAX - OPERAND_MIN) * 2;
TOTAL_CHOICES = 4;


module.exports = class MathMinigame {
  constructor(id) {
    this.name = "MathMinigame";
    this.id = id;

    // == Generate the question and answer ==
    const firstOperand = RandomUtils.randInt(OPERAND_MIN, OPERAND_MAX);
    const secondOperand = RandomUtils.randInt(OPERAND_MIN, OPERAND_MAX);
    const operation = RandomUtils.choice(["add", "subtract"]);
    
    this.question;
    this.answer;
    if (operation == "add") {
      this.question = `${firstOperand} + ${secondOperand} = ?`;
      this.answer = firstOperand + secondOperand;
    } else if (operation == "subtract") {
      this.question = `${firstOperand} - ${secondOperand} = ?`;
      this.answer = firstOperand - secondOperand;
    }

    // == Generate fake answers ==
    // We first generate an array containing the domain of possible wrong answers
    // then shuffle it and hide the correct answer there.
    // This is to keep us from having to do a while loop and keep looping if the random int is the answer,
    // which theoretically could hang the server indefinitely if we're really unlucky.
    let choices = [...Array(RESULT_RANGE).keys()].map(x => x + OPERAND_MIN).filter(x => x != this.answer);
    RandomUtils.shuffle(choices);
    choices = choices.slice(0, TOTAL_CHOICES);

    // == Hide real answer in fake answers ==
    choices.push(this.answer);
    RandomUtils.shuffle(choices);

    this.choices = choices;
  }

  serializable() {
    return {
      "name": this.name,
      "question": this.question,
      "choices": this.choices
    };
  }

  gradeAnswer(answer) {
    if (answer == this.answer) {
      return 5;
    }
    return 0;
  }
}