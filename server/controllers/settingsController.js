const Settings = require('../models/Settings');

// Get settings by key
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: req.params.key });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update or create settings by key
exports.setSettings = async (req, res) => {
  try {
    const { key } = req.params;
    const { data } = req.body;
    let settings = await Settings.findOneAndUpdate(
      { key },
      { data },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
