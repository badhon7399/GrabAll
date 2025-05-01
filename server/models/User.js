const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  // Customer segmentation/tags
  tags: [String],
  // Reviews left by the customer (for products)
  reviews: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  // Communication log (emails/newsletters sent)
  communications: [{
    type: String, // e.g., 'email', 'newsletter'
    subject: String,
    message: String,
    date: { type: Date, default: Date.now }
  }],
  // Favourites: array of Product IDs
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
