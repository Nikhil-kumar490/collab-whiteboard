import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import { useSocket } from './hooks/useSocket';

export default function App() {
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [users, setUsers] = useState([]);
  const socketRef = useSocket();

  const roomId = new URLSearchParams(window.location.search).get('room') || 'default';
  const username = localStorage.getItem('wb_username') || `User_${Math.floor(Math.random()*1000)}`;

  useEffect(() => {
    localStorage.setItem('wb_username', username);
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('connect', () => socket.emit('join-room', { roomId, username }));
    socket.on('users-update', setUsers);

    return () => { socket.off('users-update'); };
  }, [socketRef, roomId, username]);

  const handleClear = () => socketRef.current?.emit('clear-canvas');
  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <Toolbar
        tool={tool} setTool={setTool}
        color={color} setColor={setColor}
        strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth}
        onClear={handleClear} onExport={handleExport}
        onUndo={() => {}}
      />
      <div style={{ position: 'absolute', top: 60, right: 12, display: 'flex', gap: 6 }}>
        {users.map(u => (
          <span key={u.id} style={{ background: u.color, borderRadius: 20, padding: '2px 10px', fontSize: 12, color: '#fff' }}>
            {u.username}
          </span>
        ))}
      </div>
      <Canvas tool={tool} color={color} strokeWidth={strokeWidth} socketRef={socketRef} roomId={roomId} />
    </div>
  );
}
