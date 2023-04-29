const DummyMinigame = require("./minigames/dummy");
const MathMinigame = require("./minigames/math");

const Player = require("./player");
const RandomUtils = require("../utils/random");

module.exports = class Game {
  constructor(roomCode, lengthSeconds) {
    this.roomCode = roomCode;
    this.lengthSeconds = lengthSeconds;

    this.availableMinigames = [DummyMinigame, MathMinigame]

    this.players = {};
    this.minigames = [];
  }

  startGame() {
    const firstMinigame = this.#getMinigameAtIndex(0);
    const gameEnd = new Promise(resolve => setTimeout(
      () => resolve(this.#endGame()),
      this.lengthSeconds * 1000)
    );

    return {
      gameEnd: gameEnd,
      firstMinigame: firstMinigame.serializable()
    };
  }

  gradeAnswer(playerName, answer) {
    const minigameIndex = this.players[playerName].minigameProgress;
    const points = this.minigames[minigameIndex].gradeAnswer(answer);
    this.#addPoints(playerName, points);

    this.players[playerName].minigameProgress++;
    return this.#getMinigameFor(playerName).serializable();
  }

  addPlayer(playerName) {
    this.players[playerName] = new Player(playerName);
  }

  #getMinigameFor(playerName) {
    const player = this.players[playerName];
    return this.#getMinigameAtIndex(player.minigameProgress);
  }

  #endGame() {
    let scores = Object.values(this.players)
      .map(player => { return {"playerName": player.name, "score": player.score} })
      .sort((a, b) => a.score - b.score);
    return scores;
  }

  #addPoints(playerName, points) {
    this.players[playerName].score += points;
  }

  #getMinigameAtIndex(minigameIndex) {
    if (minigameIndex >= this.minigames.length) {
      const minigameClass = RandomUtils.choice(this.availableMinigames);
      const newMinigame = new minigameClass(this.minigames.length);
      this.minigames.push(newMinigame);
      return newMinigame;
    }
    return this.minigames[minigameIndex];
  }
}