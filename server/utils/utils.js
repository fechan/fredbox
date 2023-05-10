module.exports = class Utils {
  /**
   * Get an array containing the range of ints from
   * min to max (both inclusive)
   * @param {Number} min Inclusive min
   * @param {Number} max Inclusive max
   * @returns {Number[]} Range array
   */
  static range(min, max) {
    const result = [];
    for (let i = min; i <= max; i++) {
      result.push(i);
    }
    return result;
  }
}