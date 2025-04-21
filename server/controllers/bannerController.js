const Banner = require('../models/Banner');

// Get all banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create banner
exports.createBanner = async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const banner = new Banner({ image: req.body.image });
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update banner
exports.updateBanner = async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const banner = await Banner.findByIdAndUpdate(req.params.id, { image: req.body.image }, { new: true });
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
