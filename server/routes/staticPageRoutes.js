const express = require('express');
const router = express.Router();
const {
  getStaticPages,
  getStaticPageByKey,
  createStaticPage,
  updateStaticPage,
  deleteStaticPage
} = require('../controllers/staticPageController');

router.get('/', getStaticPages);
router.get('/:key', getStaticPageByKey);
router.post('/', createStaticPage);
router.put('/:id', updateStaticPage);
router.delete('/:id', deleteStaticPage);

module.exports = router;
