const Slide = require('../models/Slide');
const Product = require('../models/Product');

// Get all slides
exports.getSlides = async (req, res) => {
  try {
    const slides = await Slide.find().populate('product').sort({ order: 1, createdAt: 1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create slide
exports.createSlide = async (req, res) => {
  try {
    const slide = new Slide(req.body);
    await slide.save();
    res.status(201).json(slide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update slide
exports.updateSlide = async (req, res) => {
  try {
    const slide = await Slide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    res.json(slide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete slide
exports.deleteSlide = async (req, res) => {
  try {
    const slide = await Slide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    res.json({ message: 'Slide deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
