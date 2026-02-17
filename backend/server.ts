import app from './app';
import dotenv from 'dotenv';
import http from 'http';
import { Server, Socket } from 'socket.io';

dotenv.config();

const server = http.createServer(app);

// 🔌 REAL-TIME SOCKET LAYER
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket: Socket) => {
  console.log("🔌 New Client Connected:", socket.id);

  socket.on("track_view", (data: unknown) => {
    socket.broadcast.emit("realtime_view", data);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client Disconnected");
  });
});

import { initializeVault } from './utils/vault';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 🔐 SECURE BOOT SEQUENCE
  await initializeVault();

  server.listen(PORT, () => {
    console.log(`🚀 Elite Enterprise Engine running on port ${PORT}`);
  });
};

startServer();
