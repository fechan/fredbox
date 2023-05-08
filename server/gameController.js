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
    });
  }

  onJoinRoom(socket, params) {
    const game = this.games[params.room];
    const playerName = game.addPlayer(params.playerName);
    const roomInfo = game.getRoomInfo();
  
    socket.data.playerName = playerName;
    socket.data.game = game;
    socket.join(game.roomCode);

    console.info(`Player ${params.playerName} joined room ${game.roomCode}`);

    this.sendGameJoined(socket, roomInfo, playerName);
  }

  onCreateRoom(socket, params) { 
    const newRoomCode = crypto.randomBytes(2).toString("hex");
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

  onStartGame(socket, params) {
    const game = socket.data.game;
    const { firstMinigame, gameEnd } = game.startGame();

    const room = game.roomCode;
    this.io.to(room).emit("showMinigame", {"minigame": firstMinigame});

    gameEnd.then((scores) => this.sendEndGame(room, scores));

    console.info(`Game for room ${room} started`);
  }

  sendEndGame(roomCode, scores) {
    this.io.to(roomCode).emit("endGame", {"scores": scores});
    console.info(`Game for room ${roomCode} ended`);
  }

  onGradeAnswer(socket, params) {
    const { playerName, game } = socket.data;
    const { grade, nextMinigame } = game.gradeAnswer(playerName, params.answer);
    
    console.info(`Graded ${playerName}'s answer in ${game.roomCode}`);
    this.sendShowGrade(socket, grade)
    this.sendShowMinigame(socket, nextMinigame);
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
}