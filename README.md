# Collaborative Whiteboard 🎨

A real-time multi-user whiteboard built with the MERN stack and Socket.io. Multiple users can draw, add shapes, and collaborate simultaneously — changes sync instantly across all connected clients.

## Features
- Real-time drawing sync via WebSockets (Socket.io)
- Tools: Pen, Eraser, Rectangle, Circle, Line, Text
- Color picker & stroke width control
- Undo/Redo (per-user history)
- Room-based collaboration (share a room link)
- Canvas export as PNG
- User presence indicators (see who's in the room)

## Tech Stack
- **Frontend**: React 18, Canvas API, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB (room/session persistence)
- **Auth**: JWT (optional room passwords)

## Project Structure
```
collab-whiteboard/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas.jsx
│   │   │   ├── Toolbar.jsx
│   │   │   └── UserList.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── socket/
│   │   │   └── handlers.js
│   │   ├── routes/
│   │   │   └── rooms.js
│   │   ├── models/
│   │   │   └── Room.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup

```bash
# Backend
cd server && npm install && npm run dev

# Frontend
cd client && npm install && npm run dev
```

Open `http://localhost:5173`

## Environment Variables

```env
# server/.env
PORT=3001
MONGO_URI=mongodb://localhost:27017/whiteboard
JWT_SECRET=your_secret
```
