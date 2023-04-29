module.exports = class RandomUtils {
  /**
   * Randomly choose an element in the given array
   * @param {Array} arr Array to choose from
   * @returns Random element
   */
  static choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Get a random integer in range (both inclusive)
   * @param {Number} min Min possible value
   * @param {Number} max Max possible value
   * @returns Random integer
   */
  static randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Shuffle an array in place
   * @note Durstenfeld shuffle: https://stackoverflow.com/a/12646864
   * @param {Array} arr Array to shuffle
   */
  static shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}