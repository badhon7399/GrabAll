const express = require('express');
const router = express.Router();
const { getSettings, setSettings } = require('../controllers/settingsController');

// Get settings by key (e.g., general, payment, shipping, email)
router.get('/:key', getSettings);
// Update or create settings by key
router.put('/:key', setSettings);

module.exports = router;
