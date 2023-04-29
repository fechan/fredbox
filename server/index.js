const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({
  origin: "http://localhost:3000"
}));
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 5000;

const GameController = require("./gameController");
new GameController(io);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(port, () => console.log("Server listening on port", port));