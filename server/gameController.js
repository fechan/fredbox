const crypto = require("crypto");
const Game = require("./game_logic/game")

module.exports = class GameController {
  constructor(io) {
    this.io = io;
    this.rooms = {}; // map roomcodes to Game objects

    io.on("connection", (socket) => {
      console.info("Client connected to server");

      socket.on("joinRoom",     params => this.onJoinRoom(socket, params));
      socket.on("createRoom",   params => this.onCreateRoom(socket, params));
      socket.on("startGame",    params => this.onStartGame(socket, params));
      socket.on("gradeAnswer",  params => this.onGradeAnswer(socket, params));
    });
  }

  onJoinRoom(socket, params) {
    const room = params.room;
    socket.join(room);
    this.rooms[room].addPlayer(params.playerName);

    console.info(`Player ${params.playerName} joined room ${room}`)
  }

  onCreateRoom(socket, params) { 
    const newRoomCode = crypto.randomBytes(2).toString("hex");
    const newGame = new Game(newRoomCode, 5);
    this.rooms[newRoomCode] = newGame;

    const hostPlayerName = params.hostPlayerName;
    newGame.addPlayer(hostPlayerName);
    socket.data.playerName = hostPlayerName;
    socket.data.game = newGame;
    socket.join(newRoomCode);

    console.info(`Created room for ${hostPlayerName} with code ${newRoomCode}`);

    this.sendGameJoined(socket, newRoomCode);
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
    const nextMinigame = game.gradeAnswer(playerName, params.answer);
    
    console.info(`Graded ${playerName}'s answer in ${game.roomCode}`);
    this.sendShowMinigame(socket, nextMinigame);
  }

  sendShowMinigame(socket, minigame) {
    socket.emit("showMinigame", {"minigame": minigame});
    console.info(`- Sent new minigame ${minigame.name}`);
  }

  sendGameJoined(socket, roomCode) {
    socket.emit("gameJoined", {"roomCode": roomCode});
    console.info(`- Sent newly joined room code`);
  }
}