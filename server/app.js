// Entry point for Express MVC backend
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://graball-front.onrender.com', 'http://localhost:5173'], // add your frontend URLs
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Example Route
app.get('/', (req, res) => {
  res.send('API Running');
});

// MVC Structure: Import routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/static-pages', require('./routes/staticPageRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/slides', require('./routes/slideRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

// Serve uploads as static files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', require('./routes/uploadRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
