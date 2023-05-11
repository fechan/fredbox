const express = require("express");
const cors = require("cors");
const app = express();

if (process.env.NODE_ENV != "production") {
  app.use(cors({
    origin: "http://localhost:3000"
  }));
}

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 5000;

const GameController = require("./gameController");
new GameController(io);

app.use("/", express.static("./client/build"));

app.get("/up", (req, res) => {
  res.send("Fredbox server is up and running!");
});

server.listen(port, () => console.log("Server listening on port", port));