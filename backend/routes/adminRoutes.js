import express from 'express';
import {
  getDashboardStats,
  getAllPosts,
  getRecentPosts,
  getRecentUsers,
  getAllUsers,
  deleteUser,
  updateUserRole
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require admin privileges
router.use(protect, admin);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Posts routes
router.get('/posts', getAllPosts);
router.get('/posts/recent', getRecentPosts);

// Users routes
router.get('/users', getAllUsers);
router.get('/users/recent', getRecentUsers);
router.route('/users/:id')
  .delete(deleteUser)
  .put(updateUserRole);

export default router;