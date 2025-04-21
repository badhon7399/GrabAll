const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String }, // image, video, etc.
  name: { type: String },
  uploadedBy: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
