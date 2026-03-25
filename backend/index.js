const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {

    origin: "*"
  }
});

let connectedUsers = 0;
let typingUsers = [];

io.on('connection', (socket) => {
  connectedUsers++;
  console.log('A user connected. Total connected users:', connectedUsers);

  // Emit the number of connected users to this newly connected client
  socket.emit("connectedUsers", connectedUsers);

  // Broadcast to all clients the updated user count
  socket.broadcast.emit("connectedUsers", connectedUsers);

  socket.on("disconnect", () => {
    console.log('User disconnected. Total connected users:', connectedUsers);
    connectedUsers--;

    // Broadcast the updated user count to all clients
    socket.broadcast.emit("connectedUsers", connectedUsers);
    socket.broadcast.emit("typinguser", typingUsers);

  });

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
    console.log("Message received:", msg);
  });

  socket.on("typing_on", (user) => {
    typingUsers = [...new Set([...typingUsers, user])]
    socket.broadcast.emit("typinguser", typingUsers);
    console.log("user ", user, "typing on");
  })

  socket.on("typing_off", (user) => {
    typingUsers = typingUsers.filter(elem => elem != user);
    socket.broadcast.emit("typinguser", typingUsers);
    console.log("user ", user, "typing off")

  })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});