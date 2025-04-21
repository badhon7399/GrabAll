const StaticPage = require('../models/StaticPage');

// Get all static pages
exports.getStaticPages = async (req, res) => {
  try {
    const pages = await StaticPage.find().sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single static page by key
exports.getStaticPageByKey = async (req, res) => {
  try {
    const page = await StaticPage.findOne({ key: req.params.key });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create static page
exports.createStaticPage = async (req, res) => {
  try {
    const page = new StaticPage(req.body);
    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update static page
exports.updateStaticPage = async (req, res) => {
  try {
    const page = await StaticPage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete static page
exports.deleteStaticPage = async (req, res) => {
  try {
    const page = await StaticPage.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json({ message: 'Page deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
