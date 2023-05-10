const RandomUtils = require("../../utils/random");

const { words } = require("./words.json");

// maps bags of letters to a list of words that can be made using those letters
// each bag is actually a string that would uniquely identigy the bag
const BAGS_OF_LETTERS = {};

for (let word of words) {
  let wordLetters = word.split(""); // unsorted bag of letters in word
  let bag = Array.from(wordLetters).sort().join(""); // turn it into a hashable key that identifies this bag

  if (bag in BAGS_OF_LETTERS) {
    BAGS_OF_LETTERS[bag].push(word);
  } else {
    BAGS_OF_LETTERS[bag] = [word];
  }
}

module.exports = class UnscrambleMinigame {
  constructor(id) {
    this.name = "UnscrambleMinigame";
    this.id = id;

    let [bagOfLetters, possibleAnswers] = RandomUtils.choice(Object.entries(BAGS_OF_LETTERS));

    this.choices = bagOfLetters.split("");
    RandomUtils.shuffle(this.choices);

    this.possibleAnswers = possibleAnswers;
  }

  serialize() {
    return {
      "id": this.id,
      "name": this.name,
      "choices": this.choices
    };
  }

  gradeAnswer(answer) {
    if (this.possibleAnswers.includes(answer)) {
      return 5;
    }
    return -5;
  }
}