// backend/models/Chat.js
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  lastMessage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);

// backend/models/Message.js
const MessageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);