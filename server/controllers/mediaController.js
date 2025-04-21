const Media = require('../models/Media');

// Get all media
exports.getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create media (record, not file upload)
exports.createMedia = async (req, res) => {
  try {
    const media = new Media(req.body); // expects url, type, name, uploadedBy
    await media.save();
    res.status(201).json(media);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete media
exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });
    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
