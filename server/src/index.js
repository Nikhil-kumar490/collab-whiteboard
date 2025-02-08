require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const roomRoutes = require('./routes/rooms');
const registerSocketHandlers = require('./socket/handlers');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/whiteboard')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Socket.io
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  registerSocketHandlers(io, socket);
  socket.on('disconnect', () => console.log(`Client disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
