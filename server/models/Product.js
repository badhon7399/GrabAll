const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  featured: { type: Boolean, default: false },
  name: { type: String, required: true },
  detail: { type: String },
  price: { type: Number, required: true }, // Price in BDT (৳)
  image: { type: String },
  images: [{ type: String }],
  category: { type: String, required: true },
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

  tags: [String],
  seo: {
    metaTitle: String,
    metaDescription: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
