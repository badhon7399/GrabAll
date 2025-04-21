const express = require('express');
const router = express.Router();
const {
  getMedia,
  createMedia,
  deleteMedia
} = require('../controllers/mediaController');

router.get('/', getMedia);
router.post('/', createMedia);
router.delete('/:id', deleteMedia);

module.exports = router;
