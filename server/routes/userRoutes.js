const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addReview,
  addCommunication,
  getProfile,
  updateProfile,
  getFavourites,
  addFavourite,
  removeFavourite
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/review', addReview);
router.post('/:id/communication', addCommunication);

// Profile routes
router.get('/profile/me', protect, getProfile);
router.put('/profile/me', protect, updateProfile);

// Favourites routes
router.get('/favourites', protect, getFavourites);
router.post('/favourites/:productId', protect, addFavourite);
router.delete('/favourites/:productId', protect, removeFavourite);

module.exports = router;
