const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { v4: uuidV4 } = require("uuid");
const cors = require("cors");
const {instrument} = require("@socket.io/admin-ui")

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const usersId = {}

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  console.log(req.params.room);
  res.json(req.params.room);
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId,name) => {
    usersId[userId] = name;
    console.log(`Room ID: ${roomId}, User ID: ${userId}`);
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
    socket.on('send-message', (message) => {
      console.log(message);
      socket.emit('recive-message', message);
    });
  });
});



server.listen(3001, () => {
  console.log("running on 3001");
});

instrument(io,{auth:false})