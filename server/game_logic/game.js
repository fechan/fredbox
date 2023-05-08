const StroopEffectMinigame = require("./minigames/stroopEffect");
const MathMinigame = require("./minigames/math");

const Player = require("./player");
const RandomUtils = require("../utils/random");

module.exports = class Game {
  constructor(roomCode, lengthSeconds) {
    this.roomCode = roomCode;
    this.lengthSeconds = lengthSeconds;

    this.availableMinigames = [StroopEffectMinigame, MathMinigame]

    this.players = {};
    this.minigames = [];

    this.host;
  }

  startGame() {
    const firstMinigame = this.#getMinigameAtIndex(0);
    const gameEnd = new Promise(resolve => setTimeout(
      () => resolve(this.#endGame()),
      this.lengthSeconds * 1000)
    );

    return {
      gameEnd: gameEnd,
      firstMinigame: firstMinigame.serialize()
    };
  }

  gradeAnswer(playerName, answer) {
    const minigameIndex = this.players[playerName].minigameProgress;
    const points = this.minigames[minigameIndex].gradeAnswer(answer);
    this.#addPoints(playerName, points);

    this.players[playerName].minigameProgress++;
    return {
      "grade": points,
      "nextMinigame": this.#getMinigameFor(playerName).serialize()
    };
  }

  /**
   * Add a player with the given name
   * @param {String} playerName 
   * @returns Name of the player added
   */
  addPlayer(playerName) {
    const newPlayer = new Player(playerName)
    this.players[playerName] = newPlayer;

    if (!this.host) this.host = newPlayer;
  
    return playerName;
  }

  /**
   * Get basic room information
   * @returns Room code, player list, and name of host
   */
  getRoomInfo() {
    return {
      "roomCode": this.roomCode,
      "players": Object.values(this.players).map(player => player.serialize()),
      "host": this.host.name
    };
  }

  #getMinigameFor(playerName) {
    const player = this.players[playerName];
    return this.#getMinigameAtIndex(player.minigameProgress);
  }

  #endGame() {
    let scores = Object.values(this.players)
      .map(player => { return {"playerName": player.name, "score": player.score} })
      .sort((a, b) => b.score - a.score);
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