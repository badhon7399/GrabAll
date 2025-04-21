const mongoose = require('mongoose');

const staticPageSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'about', 'contact', 'terms'
  title: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('StaticPage', staticPageSchema);
