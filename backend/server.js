const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// 1. Create the HTTP Server using Express
const server = http.createServer(app);

// 2. Initialize Socket.io and attach it to the server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your Frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// --- YOUR SOCKET LOGIC ---
let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = users.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", { senderId, text });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

// 3. Listen on a Port
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});