const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController');

// GET all slides
router.get('/', slideController.getSlides);
// CREATE a slide
router.post('/', slideController.createSlide);
// UPDATE a slide
router.put('/:id', slideController.updateSlide);
// DELETE a slide
router.delete('/:id', slideController.deleteSlide);

module.exports = router;
