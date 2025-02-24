const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Room = require('../models/Room');

const router = express.Router();

// Create a new room
router.post('/', async (req, res) => {
  try {
    const { name, password, createdBy } = req.body;
    const room = await Room.create({ roomId: uuidv4(), name, password, createdBy });
    res.status(201).json({ roomId: room.roomId, name: room.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get room info
router.get('/:roomId', async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({ roomId: room.roomId, name: room.name, hasPassword: !!room.password });
});

module.exports = router;
