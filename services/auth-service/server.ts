import app from './app';
import dotenv from 'dotenv';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { connectDatabase } from './data/database';

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

import { sendSlackNotification } from './utils/sendSlack';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // 🔐 BOOT SEQUENCE
  await connectDatabase();

  server.listen(PORT, () => {
    console.log(`🚀 Elite Enterprise Engine running on port ${PORT}`);
    sendSlackNotification("🚀 *Sovereign Backend Engine Started* - Systems Online", 'info');
  });
};

// 🛑 Graceful Shutdown with Notification
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  await sendSlackNotification("🛑 *Sovereign Backend Engine Stopping* - Graceful Shutdown Initiated", 'alert');
  server.close(() => {
    process.exit(0);
  });
});

startServer();
