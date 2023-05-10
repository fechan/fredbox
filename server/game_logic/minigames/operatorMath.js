const RandomUtils = require("../../utils/random");
const Utils = require("../../utils/utils");

OPERATORS = {
  "+": (lhs, rhs) => lhs + rhs,
  "−": (lhs, rhs) => lhs - rhs,
  "×": (lhs, rhs) => lhs * rhs,
  "÷": (lhs, rhs) => lhs / rhs
};

OPERAND_MIN = 0;
OPERAND_MAX = 10;

QUESTIONS = {
  "+": [],
  "−": [],
  "×": [],
  "÷": []
};

/**
 * Generate the domain of possible questions such that
 * lhs, rhs, and the result are all integers
 */
for (const operator of Object.keys(OPERATORS)) {
  for (const lhs of Utils.range(OPERAND_MIN, OPERAND_MAX)) {
    for (const rhs of Utils.range(OPERAND_MIN, OPERAND_MAX)) {
      const result = OPERATORS[operator](lhs, rhs);
      if (Number.isInteger(result)) {
        QUESTIONS[operator].push({lhs: lhs, rhs: rhs, result: result});
      }
    }
  }
}

module.exports = class OperatorMathMinigame {
  constructor(id) {
    this.name = "OperatorMathMinigame";
    this.id = id;

    this.choices = Object.keys(OPERATORS);

    const operator = RandomUtils.choice(this.choices);
    this.question = RandomUtils.choice(QUESTIONS[operator]);
  }

  serialize() {
    return {
      "id": this.id,
      "name": this.name,
      "question": `${this.question.lhs} _ ${this.question.rhs} = ${this.question.result}`,
      "choices": this.choices
    }
  }

  gradeAnswer(answer) {
    const {lhs, rhs, result} = this.question;
    const answerResult = OPERATORS[answer](lhs, rhs);
    if (answerResult === result) {
      return 5;
    }
    return -5;
  }
}