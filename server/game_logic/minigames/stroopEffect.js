const RandomUtils = require("../../utils/random");

COLORS = ["red", "green", "blue", "purple", "black", "orange"];
TOTAL_CHOICES = 6;

/**
 * A correct reference color is randomly chosen, then
 * the player is asked to choose from a list of possible answers,
 * such that the selected answer's text matches the reference color, OR
 * such that the selected answer's display color matches the reference color.
 * Each choice will have a color word ("green") and be displayed in a
 * color ("red") which may/may not be different from the word.
 * 
 * It takes advantage of the Stroop Effect, hence the name.
 * 
 * @Parameters
 * - playerShouldSelect:  Either "textColor" or "word" depending on whether the player
 *                        should be selecting the display color or the word's text
 * - correctColor:        The color that the player should select
 * 
 * @Choices
 * Each choice is an object with the following keys:
 * - textColor: The display color of the choice
 * - word:      The text of the choice
 */
module.exports = class StroopEffectMinigame {
  constructor(id) {
    this.name = "StroopEffectMinigame";
    this.id = id;

    let words = COLORS;
    RandomUtils.shuffle(words);
    words = words.slice(0, TOTAL_CHOICES);
    
    let textColors = COLORS;
    RandomUtils.shuffle(textColors);
    textColors = textColors.slice(0, TOTAL_CHOICES);

    this.choices = words.map((word, i) => {
      return {"word": word, "textColor": textColors[i]}
    });

    this.playerShouldSelect = RandomUtils.choice(["textColor", "word"]);
    this.correctColor = RandomUtils.choice(this.choices)[this.playerShouldSelect];
  }

  serialize() {
    return {
      "name": this.name,
      "playerShouldSelect": this.playerShouldSelect,
      "correctColor": this.correctColor,
      "choices": this.choices
    }
  }

  gradeAnswer(answer) {
    if (answer[this.playerShouldSelect] == this.correctColor) {
      return 5;
    }
    return -5;
  }
}