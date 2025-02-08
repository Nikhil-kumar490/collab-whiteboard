const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  name: { type: String, default: 'Untitled Room' },
  password: { type: String, default: null },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);
