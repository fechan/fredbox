const StroopEffectMinigame = require("./minigames/stroopEffect");
const MathMinigame = require("./minigames/math");
const OperatorMathMinigame = require("./minigames/operatorMath");
const UnscrambleMinigame = require("./minigames/unscramble");

const Player = require("./player");
const RandomUtils = require("../utils/random");

module.exports = class Game {
  constructor(roomCode, lengthSeconds) {
    this.roomCode = roomCode;
    this.lengthSeconds = lengthSeconds;
    this.gameEnded = false;

    this.availableMinigames = [
      StroopEffectMinigame,
      MathMinigame,
      OperatorMathMinigame,
      UnscrambleMinigame
    ];
    
    this.host;
    this.players = {};
    this.minigames = [];
  }

  /**
   * Start the game
   * @returns First minigame of the game (serialized)
   */
  startGame() {
    this.#resetGame()

    const firstMinigame = this.#getMinigameAtIndex(0);
    return firstMinigame.serialize();
  }

  /**
   * Check if all players in the game are done, and end the game if they are
   * @returns Scoreboard if done, null otherwise
   */
  endGameIfPlayersDone() {
    for (const player of Object.values(this.players)) {
      if (player.isDone == false) {
        return null;
      }
    }

    this.gameEnded = true;
    let scores = Object.values(this.players)
      .map(player => { return {"playerName": player.name, "score": player.score} })
      .sort((a, b) => b.score - a.score);
    return scores;
  }

  setPlayerDone(playerName) {
    this.players[playerName].isDone = true;
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
   * Remove the given player from the player list by name.
   * If they were the host, arbitrarily choose the new host to be
   * one of the remaining players
   * @param {String} playerName Name of player to remove
   * @returns true if the host player changed due to player removal
   */
  removePlayer(playerName) {
    delete this.players[playerName];
    
    let hostPlayerChanged = playerName === this.host.name;
    if (hostPlayerChanged) {
      this.host = Object.values(this.players)[0];
    }

    return hostPlayerChanged;
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

  /**
   * Get if the room is stale and references to it should be destroyed
   * @returns true if the room is stale
   */
  getIsStale() {
    return Object.keys(this.players).length <= 0;
  }

  #getMinigameFor(playerName) {
    const player = this.players[playerName];
    return this.#getMinigameAtIndex(player.minigameProgress);
  }

  #addPoints(playerName, points) {
    this.players[playerName].score += points;
  }

  /**
   * Get the minigame at the given index.
   * If the index doesn't exist (e.g. the fastest person needs a new minigame)
   * then this will instantiate new ones and add it to the minigame list.
   * 
   * New minigames are added to the list via a tetris-like selection algorithm.
   * i.e. if we need to instantiate new minigames, then we randomize the available
   * minigames, create instances of them, and add them to the end of the mingames list.
   * This ensures we have a fairly even-feeling distribution of minigames.
   * 
   * @param {Number} minigameIndex Minigame index
   * @returns Minigame instance
   */
  #getMinigameAtIndex(minigameIndex) {
    if (minigameIndex >= this.minigames.length) {
      RandomUtils.shuffle(this.availableMinigames);
      for (let i=0; i < this.availableMinigames.length; i++) {
        const minigameClass = this.availableMinigames[i];
        this.minigames.push(new minigameClass(this.minigames.length + i));
      }
    }
    return this.minigames[minigameIndex];
  }

  #resetGame() {
    Object.values(this.players).forEach(player => player.reset());
    this.minigames = [];
    this.gameEnded = false;
  }
}