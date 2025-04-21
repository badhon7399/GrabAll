const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'general', 'payment', 'shipping', 'email'
  data: { type: Object, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
