import React, { useRef, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Canvas({ tool, color, strokeWidth, socketRef, roomId }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const currentStroke = useRef(null);
  const [strokes, setStrokes] = useState([]);

  // Redraw all strokes
  const redraw = useCallback((strokeList) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokeList.forEach(s => drawStroke(ctx, s));
  }, []);

  useEffect(() => { redraw(strokes); }, [strokes, redraw]);

  // Socket listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('canvas-state', (existing) => setStrokes(existing));
    socket.on('draw-stroke', (stroke) => setStrokes(prev => [...prev, stroke]));
    socket.on('clear-canvas', () => setStrokes([]));
    socket.on('undo', ({ strokeId }) => setStrokes(prev => prev.filter(s => s.id !== strokeId)));

    return () => {
      socket.off('canvas-state');
      socket.off('draw-stroke');
      socket.off('clear-canvas');
      socket.off('undo');
    };
  }, [socketRef]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMouseDown = (e) => {
    drawing.current = true;
    const pos = getPos(e);
    currentStroke.current = {
      id: uuidv4(), tool, color,
      strokeWidth: tool === 'eraser' ? 20 : strokeWidth,
      points: [pos], startX: pos.x, startY: pos.y
    };
  };

  const onMouseMove = (e) => {
    if (!drawing.current || !currentStroke.current) return;
    const pos = getPos(e);
    currentStroke.current.points.push(pos);
    currentStroke.current.endX = pos.x;
    currentStroke.current.endY = pos.y;

    // Live preview
    const ctx = canvasRef.current.getContext('2d');
    redraw(strokes);
    drawStroke(ctx, currentStroke.current);
  };

  const onMouseUp = () => {
    if (!drawing.current || !currentStroke.current) return;
    drawing.current = false;
    const stroke = currentStroke.current;
    setStrokes(prev => [...prev, stroke]);
    socketRef.current?.emit('draw-stroke', stroke);
    currentStroke.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight - 60}
      style={{ display: 'block', background: '#fff', cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    />
  );
}

function drawStroke(ctx, stroke) {
  ctx.save();
  ctx.strokeStyle = stroke.tool === 'eraser' ? '#ffffff' : stroke.color;
  ctx.lineWidth = stroke.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (stroke.tool === 'pen' || stroke.tool === 'eraser') {
    ctx.beginPath();
    stroke.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
  } else if (stroke.tool === 'rect') {
    ctx.strokeRect(stroke.startX, stroke.startY, stroke.endX - stroke.startX, stroke.endY - stroke.startY);
  } else if (stroke.tool === 'circle') {
    const rx = Math.abs(stroke.endX - stroke.startX) / 2;
    const ry = Math.abs(stroke.endY - stroke.startY) / 2;
    ctx.beginPath();
    ctx.ellipse(stroke.startX + rx, stroke.startY + ry, rx, ry, 0, 0, 2 * Math.PI);
    ctx.stroke();
  } else if (stroke.tool === 'line') {
    ctx.beginPath();
    ctx.moveTo(stroke.startX, stroke.startY);
    ctx.lineTo(stroke.endX ?? stroke.startX, stroke.endY ?? stroke.startY);
    ctx.stroke();
  }
  ctx.restore();
}
