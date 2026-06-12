import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  addUserAddress,
  editUserAddress,
  deleteUserAddress,
  getUserWishlist,
  toggleUserWishlist,
  blockUser
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Wishlist
router.route('/wishlist').get(protect, getUserWishlist);
router.route('/wishlist/:productId').post(protect, toggleUserWishlist);

// Addresses
router.route('/addresses').post(protect, addUserAddress);
router.route('/addresses/:addressId')
  .put(protect, editUserAddress)
  .delete(protect, deleteUserAddress);

// Admin user block/unblock
router.route('/:id/block').put(protect, admin, blockUser);

export default router;
