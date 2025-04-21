const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProductsCSV,
  importProductsCSV,
  getFeaturedProducts
} = require('../controllers/productController');

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/export/csv', exportProductsCSV);
router.post('/import/csv', importProductsCSV);

module.exports = router;
