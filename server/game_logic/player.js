module.exports = class Player {
  constructor(playerName) {
    this.name = playerName;
    this.score = 0;
    this.minigameProgress = 0;
  }

  reset() {
    this.score = 0;
    this.minigameProgress = 0;
  }

  serialize() {
    return {
      "name": this.name,
      "score": this.score,
      "minigameProgress": this.minigameProgress
    };
  }
}