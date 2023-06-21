const RandomUtils = require("../../utils/random");

const { words } = require("./words.json");
const SORT_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
const NUMBERS_TO_LETTERS = {
  "1": "",
  "2": "abc",
  "3": "def",
  "4": "ghi",
  "5": "jkl",
  "6": "mno",
  "7": "pqrs",
  "8": "tuv",
  "9": "wxyz",
  "*": "",
  "0": "+",
  "#": "",
}

let LETTERS_TO_NUMBERS = {};
for (const [num, letters] of Object.entries(NUMBERS_TO_LETTERS)) {
  for (let i = 0; i < letters.length; i++) {
    LETTERS_TO_NUMBERS[letters[i]] = num;
  }
}

module.exports = class DialMinigame {
  constructor(id) {
    this.name = "DialMinigame";
    this.id = id;

    this.dialWord = RandomUtils.choice(words);
    this.toDial = "";
    for (let i = 0; i < this.dialWord.length; i++) {
      this.toDial += LETTERS_TO_NUMBERS[this.dialWord[i]];
    }
  }

  serialize() {
    return {
      "id": this.id,
      "name": this.name,
      "toDial": this.toDial,
      "dialWord": this.dialWord,
      choices: SORT_ORDER.map(number => {
        return {
          "number": number,
          "letters": NUMBERS_TO_LETTERS[number],
        }
      })
    }
  }

  gradeAnswer(answer) {
    if (answer === this.toDial) {
      return 5;
    }
    return -5;
  }
}