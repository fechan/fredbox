const RandomUtils = require("../../utils/random");

const NUMBER_OF_BOXES = 2;
const POSSIBLE_ROTATIONS = [0, 90, 180, 270];
const POSSIBLE_MIRRORS = ["none", "horizontal"];
const POSSIBLE_SYMBOLS = ["F", "G", "J", "L", "N", "P", "R"]; // make ABSOLUTELY SURE the symbol has NO symmetry, otherwise mirroring is the same as rotating!

/**
 * Tom's Spatial Visualization minigame generates two boxes.
 * In each box, there are two shapes, which is a
 * rotated and/or mirrored versions of the other.
 * The player must answer with the number of boxes where the shape
 * has been rotated but NOT mirrored.
 * 
 * @Parameters
 * - shape: A unicode character to use as the shape to rotate and/or mirror.
 * - boxes: An array of objects describing the top and bottom shape's
 *          transformation in each box
 * 
 * @Choices
 * An array containing [0, 1, ..., n], where n is the number of total boxes.
 */
module.exports = class TomSpatialVisualization {
  constructor(id) {
    this.name = "TomSpatialVisualization";
    this.id = id;
    this.choices = [...Array(NUMBER_OF_BOXES+1).keys()];
    this.answer = 0;
    this.shape = RandomUtils.choice(POSSIBLE_SYMBOLS);
    this.boxes = [];

    for (let boxNbr = 0; boxNbr < NUMBER_OF_BOXES; boxNbr++) {
      const topMirror = RandomUtils.choice(POSSIBLE_MIRRORS);
      const bottomMirror = RandomUtils.choice(POSSIBLE_MIRRORS);
      this.boxes.push({
        "topRotation": RandomUtils.choice(POSSIBLE_ROTATIONS),
        "topMirror": topMirror,
        "bottomRotation": RandomUtils.choice(POSSIBLE_ROTATIONS),
        "bottomMirror": bottomMirror,
      });

      if (topMirror === bottomMirror) this.answer++;
    }
  }

  /**
   * Get the data required for the client to render this minigame question
   * @returns {Object} Serialized version of this question's data
   */
  serialize() {
    return {
      "id": this.id,
      "name": this.name,
      "choices": this.choices,
      "boxes": this.boxes,
      "shape": this.shape,
    };
  }

  /**
   * Award or deduct points depending on if the answer is correct
   * @param {Number} answer Answer chosen by the player
   * @returns Points to add to the player score
   */
  gradeAnswer(answer) {
    return this.answer == answer ? 5 : -5;
  }
}