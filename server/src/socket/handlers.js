// In-memory room state (use Redis for production)
const rooms = new Map(); // roomId -> { users: Map, strokes: [] }

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, { users: new Map(), strokes: [] });
  }
  return rooms.get(roomId);
}

module.exports = function registerSocketHandlers(io, socket) {

  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.username = username;

    const room = getRoom(roomId);
    room.users.set(socket.id, { id: socket.id, username, color: randomColor() });

    // Send existing strokes to new user
    socket.emit('canvas-state', room.strokes);

    // Broadcast updated user list
    io.to(roomId).emit('users-update', Array.from(room.users.values()));
    socket.to(roomId).emit('user-joined', { username });
  });

  socket.on('draw-stroke', (stroke) => {
    const { roomId } = socket.data;
    if (!roomId) return;
    const room = getRoom(roomId);
    room.strokes.push(stroke);
    socket.to(roomId).emit('draw-stroke', stroke);
  });

  socket.on('clear-canvas', () => {
    const { roomId } = socket.data;
    if (!roomId) return;
    getRoom(roomId).strokes = [];
    io.to(roomId).emit('clear-canvas');
  });

  socket.on('undo', ({ strokeId }) => {
    const { roomId } = socket.data;
    if (!roomId) return;
    const room = getRoom(roomId);
    room.strokes = room.strokes.filter(s => s.id !== strokeId);
    io.to(roomId).emit('undo', { strokeId });
  });

  socket.on('disconnecting', () => {
    const { roomId, username } = socket.data;
    if (!roomId) return;
    const room = getRoom(roomId);
    room.users.delete(socket.id);
    io.to(roomId).emit('users-update', Array.from(room.users.values()));
    socket.to(roomId).emit('user-left', { username });
  });
};

function randomColor() {
  const colors = ['#f87171','#60a5fa','#34d399','#fbbf24','#a78bfa','#f472b6'];
  return colors[Math.floor(Math.random() * colors.length)];
}

# feat-undo-stack
