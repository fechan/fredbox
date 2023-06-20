module.exports = class Player {
  constructor(playerName) {
    this.name = playerName;
    this.score = 0;
    this.minigameProgress = 0;
    this.isDone = false;
  }

  reset() {
    this.score = 0;
    this.minigameProgress = 0;
    this.isDone = false;
  }

  serialize() {
    return {
      "name": this.name,
      "score": this.score,
      "minigameProgress": this.minigameProgress,
      "isDone": this.isDone
    };
  }
}