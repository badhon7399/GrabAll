const Product = require('../models/Product');
const csv = require('fast-csv');
const fs = require('fs');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    // Remove variations if sent from old clients
    if ('variations' in req.body) delete req.body.variations;
    // Ensure images is always an array
    if (!Array.isArray(req.body.images)) req.body.images = [];
    // Always set main image to first in images array if present
    if (req.body.images.length > 0) req.body.image = req.body.images[0];
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    // Remove variations if sent from old clients
    if ('variations' in req.body) delete req.body.variations;
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bulk CSV export (mock, exports all products)
exports.exportProductsCSV = async (req, res) => {
  try {
    const products = await Product.find();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    csv.write(products.map(p => p.toObject()), { headers: true }).pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk CSV import (mock, expects array of products in req.body.products)
exports.importProductsCSV = async (req, res) => {
  try {
    const products = req.body.products || [];
    const inserted = await Product.insertMany(products);
    res.json({ message: `${inserted.length} products imported`, products: inserted });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
