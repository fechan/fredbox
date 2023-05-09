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
      socket.on("gradeAnswer",  params => this.onGradeAnswer(socket, params));
      socket.on("disconnect",   params => this.onDisconnect(socket, params));
    });
  }

  onJoinRoom(socket, params) {
    const roomToJoin = params.room.toUpperCase();
    const game = this.games[roomToJoin];
    const playerName = game.addPlayer(params.playerName);
    const roomInfo = game.getRoomInfo();

    this.sendRoomInfoChanged(roomInfo);
  
    socket.data.playerName = playerName;
    socket.data.game = game;
    socket.join(game.roomCode);

    console.info(`Player ${params.playerName} joined room ${game.roomCode}`);

    this.sendGameJoined(socket, roomInfo, playerName);
  }

  onCreateRoom(socket, params) { 
    const newRoomCode = crypto.randomBytes(2).toString("hex").toUpperCase();
    const newGame = new Game(newRoomCode, 20);
    this.games[newRoomCode] = newGame;

    const hostPlayerName = newGame.addPlayer(params.hostPlayerName);
    const roomInfo = newGame.getRoomInfo();
  
    socket.data.playerName = hostPlayerName;
    socket.data.game = newGame;
    socket.join(newRoomCode);

    console.info(`Created room for ${hostPlayerName} with code ${newRoomCode}`);

    this.sendGameJoined(socket, roomInfo, hostPlayerName);
  }

  onDisconnect(socket, params) {
    if (this.#socketNotInActiveGame(socket, false)) return;

    const { playerName, game } = socket.data;
    game.removePlayer(playerName);
    
    console.info(`Player ${playerName} disconnected`);
    if (game.getIsStale()) {
      delete this.games[game.roomCode];
      console.info(`Deleted a stale game`);
    } else {
      this.sendRoomInfoChanged(game.getRoomInfo());
    }
  }

  onStartGame(socket, params) {
    if (this.#socketNotInActiveGame(socket)) return;

    const game = socket.data.game;
    const { firstMinigame, gameEnd } = game.startGame();

    const room = game.roomCode;
    this.io.to(room).emit("showMinigame", {"minigame": firstMinigame});

    gameEnd.then((scores) => this.sendEndGame(room, scores));

    console.info(`Game for room ${room} started`);
  }

  onGradeAnswer(socket, params) {
    if (this.#socketNotInActiveGame(socket)) return;

    const { playerName, game } = socket.data;
    const { grade, nextMinigame } = game.gradeAnswer(playerName, params.answer);
    
    console.info(`Graded ${playerName}'s answer in ${game.roomCode}`);
    this.sendShowGrade(socket, grade)
    this.sendShowMinigame(socket, nextMinigame);
  }

  sendEndGame(roomCode, scores) {
    this.io.to(roomCode).emit("endGame", {"scores": scores});
    console.info(`Game for room ${roomCode} ended`);
  }

  sendShowMinigame(socket, minigame) {
    socket.emit("showMinigame", {"minigame": minigame});
    console.info(`- Sent new minigame ${minigame.name}`);
  }

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

  sendRoomInfoChanged(roomInfo) {
    this.io.to(roomInfo.roomCode).emit("roomInfoChanged", {"roomInfo": roomInfo});
    console.info(`- Sent new roomInfo to all players in room ${roomInfo.roomCode}`);
  }

  sendError(socket, code, message) {
    socket.emit("error", {
      "code": code,
      "message": message
    });
    console.info(`- Sent ${code} error to socket ${socket.id}`);
  }

  #socketNotInActiveGame(socket, sendError=true) {
    if (socket.data.game == null) {
      if (sendError) this.sendError(socket, "userHasGotNoGame", "You were disconnected from the game!");
      return true;
    } else if (!(socket.data.game.roomCode in this.games)) {
      socket.data.game = null;
      if (sendError) this.sendError(socket, "userInStaleGame", "This game has already ended!");
      return true;
    }
    return false;
  }
}