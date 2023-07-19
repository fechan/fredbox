const crypto = require("crypto");
const Game = require("./game_logic/game")

module.exports = class GameController {
  constructor(io) {
    this.io = io;
    this.games = {}; // map roomcodes to Game objects

    io.on("connection", (socket) => {
      console.info("Client connected to server");

      socket.on("joinRoom",     params => this.onJoinRoom(socket, params));
      socket.on("createRoom",   params => this.onCreateRoom(socket, params));
      socket.on("startGame",    params => this.onStartGame(socket, params));
      socket.on("playerDone",   params => this.onPlayerDone(socket, params));
      socket.on("gradeAnswer",  params => this.onGradeAnswer(socket, params));
      socket.on("disconnect",   params => this.onDisconnectOrLeaveRoom(socket, params));
      socket.on("leaveRoom",    params => this.onDisconnectOrLeaveRoom(socket, params));
    });
  }

  /**
   * Called when a player joins a room.
   * 
   * Server will send `roomInfoChanged` to everyone already in the room
   * and `gameJoined` to the new player.
   * @param {String} params.room        Room code to join (not case sensitive)
   * @param {String} params.playerName  Name of joining player
   */
  onJoinRoom(socket, params) {
    const roomToJoin = params.room.toUpperCase();
    const game = this.games[roomToJoin];
    if (game == null) {
      this.sendError(socket, "gameNotFound", `Room with code ${roomToJoin} not found!`)
      return;
    }

    const playerName = game.addPlayer(params.playerName);
    const roomInfo = game.getRoomInfo();

    this.sendRoomInfoChanged(roomInfo);
  
    socket.data.playerName = playerName;
    socket.data.game = game;
    socket.join(game.roomCode);

    console.info(`Player ${params.playerName} joined room ${game.roomCode}`);

    this.sendGameJoined(socket, roomInfo, playerName);
  }

  /**
   * Called when a player creates a room.
   * 
   * Server will send `gameJoined` to the new player, who is made the host.
   * @param {String} params.hostPlayerName Name of player who created the room
   */
  onCreateRoom(socket, params) { 
    const newRoomCode = crypto.randomBytes(2).toString("hex").toUpperCase();
    const newGame = new Game(newRoomCode, 60 + 3);
    this.games[newRoomCode] = newGame;

    const hostPlayerName = newGame.addPlayer(params.hostPlayerName);
    const roomInfo = newGame.getRoomInfo();
  
    socket.data.playerName = hostPlayerName;
    socket.data.game = newGame;
    socket.join(newRoomCode);

    console.info(`Created room for ${hostPlayerName} with code ${newRoomCode}`);

    this.sendGameJoined(socket, roomInfo, hostPlayerName);
  }

  onDisconnectOrLeaveRoom(socket, params) {
    if (this.#socketNotInActiveRoom(socket, false)) return;

    const { playerName, game } = socket.data;
    game.removePlayer(playerName);
    socket.leave(game.roomCode);
    
    console.info(`Player ${playerName} disconnected`);
    if (game.getIsStale()) {
      delete this.games[game.roomCode];
      console.info(`Deleted a stale game`);
    } else {
      this.sendRoomInfoChanged(game.getRoomInfo());
    }
  }

  /**
   * Called when the host starts the game.
   * 
   * The server will send `setGameLength` and `showMinigame` to the entire room
   */
  onStartGame(socket, params) {
    if (this.#socketNotInActiveRoom(socket)) return;

    const game = socket.data.game;
    const firstMinigame = game.startGame();

    const room = game.roomCode;
    this.io.to(room).emit("setGameLength", {"seconds": game.lengthSeconds}); // TODO: when we implement changing options in the lobby screen, this should be moved out
    this.io.to(room).emit("showMinigame", {"minigame": firstMinigame});

    console.info(`Game for room ${room} started`);
  }

  onPlayerDone(socket, params) {
    if (this.#socketNotInActiveRoom(socket)) return;

    const { playerName, game } = socket.data;
    game.setPlayerDone(playerName);
    const scores = game.endGameIfPlayersDone();
    console.info(`Player ${playerName} reported done`);

    if (scores !== null) {
      const room = game.roomCode;
      console.info(`Game for room ${room} ended`);
      this.sendEndGame(room, scores);
    }
  }

  onGradeAnswer(socket, params) {
    if (this.#socketNotInActiveRoom(socket)) return;

    const { playerName, game } = socket.data;

    if (game.gameEnded) {
      // NOTE: occasionally players send a grade request immediately after the game ends on the server
      //       probably don't want to error there. Should we be erroring other than this scenario?
      //this.sendError(socket, "userSentAnswerToEndedGame", "You were disconnected from the game!");
      return;
    }

    const { grade, nextMinigame } = game.gradeAnswer(playerName, params.answer);
    
    console.info(`Graded ${playerName}'s answer in ${game.roomCode}`);
    this.sendShowGrade(socket, grade)
    this.sendShowMinigame(socket, nextMinigame);
    this.sendUpdateScores(game.roomCode, game.getScores());
  }

  sendUpdateScores(roomCode, scores) {
    this.io.to(roomCode).emit("updateScores", {"scores": scores});
    console.info(`Scores sent to ${roomCode}`);
  }

  sendEndGame(roomCode, scores) {
    this.io.to(roomCode).emit("endGame", {"scores": scores});
    console.info(`Game for room ${roomCode} ended`);
  }

  sendShowMinigame(socket, minigame) {
    socket.emit("showMinigame", {"minigame": minigame});
    console.info(`- Sent new minigame ${minigame.name}`);
  }

  /**
   * Send room information to a player newly joining a room
   * @param {Socket} socket       Joining player's socket
   * @param {Object} roomInfo     Details of room being joined
   * @param {String} joinedPlayer Name of player who joined the room
   */
  sendGameJoined(socket, roomInfo, joinedPlayer) {
    socket.emit("gameJoined", {
      "roomInfo": roomInfo,
      "joinedPlayer": joinedPlayer
    });
    console.info(`- Sent newly joined room's info`);
  }

  sendShowGrade(socket, pointsEarned) {
    socket.emit("showGrade", {"points": pointsEarned})
    console.info(`- Sent points earned for graded answer`);
  }

  /**
   * Send details about the room (players, host, options) to everyone in it
   * @param {Object} roomInfo Room information
   */
  sendRoomInfoChanged(roomInfo) {
    this.io.to(roomInfo.roomCode).emit("roomInfoChanged", {"roomInfo": roomInfo});
    console.info(`- Sent new roomInfo to all players in room ${roomInfo.roomCode}`);
  }

  /**
   * Send an error to the given socket
   * @param {Socket} socket   Socket to send to
   * @param {String} code     Machine-readable error code
   * @param {String} message  Human-readable error message
   */
  sendError(socket, code, message) {
    socket.emit("error", {
      "code": code,
      "message": message
    });
    console.error(`- Sent ${code} error to socket ${socket.id}`);
  }

  #socketNotInActiveRoom(socket, sendError=true) {
    if (socket.data.game == null) {
      if (sendError) this.sendError(socket, "userHasGotNoGame", "You were disconnected from the game!");
      return true;
    } else if (!(socket.data.game.roomCode in this.games)) {
      socket.data.game = null;
      if (sendError) this.sendError(socket, "userInStaleGame", "This room has already closed!");
      return true;
    }
    return false;
  }
}