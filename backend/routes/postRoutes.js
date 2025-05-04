import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  commentPost,
  likePost,
  getUserPosts
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Get all posts (public)
router.get('/', getPosts);

// Get user's posts (protected)
router.get('/user', protect, getUserPosts);

// Create a post (protected)
router.post('/', protect, upload.single('image'), createPost);

// Comment & like routes
router.post('/:id/comments', protect, commentPost);
router.put('/:id/like', protect, likePost);

// Single post routes (get, update, delete)
router.route('/:id')
  .get(getPostById)
  .put(protect, upload.single('image'), updatePost)
  .delete(protect, deletePost);

export default router;