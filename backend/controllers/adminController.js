import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get total posts
  const totalPosts = await Post.countDocuments();
  
  // Get total users
  const totalUsers = await User.countDocuments();
  
  // Get total comments
  const posts = await Post.find({});
  const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0);
  
  // Get total likes
  const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);
  
  res.json({
    totalPosts,
    totalUsers,
    totalComments,
    totalLikes
  });
});

// @desc    Get all posts for admin
// @route   GET /api/admin/posts
// @access  Private/Admin
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
  
  res.json(posts);
});

// @desc    Get recent posts
// @route   GET /api/admin/posts/recent
// @access  Private/Admin
const getRecentPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);
  
  res.json(posts);
});

// @desc    Get recent users
// @route   GET /api/admin/users/recent
// @access  Private/Admin
const getRecentUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(5);
  
  res.json(users);
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 });
  
  res.json(users);
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot delete your own account');
  }
  
  await user.deleteOne();
  
  res.json({ message: 'User removed' });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Update admin status
  user.isAdmin = Boolean(req.body.isAdmin);
  
  const updatedUser = await user.save();
  
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin
  });
});

export {
  getDashboardStats,
  getAllPosts,
  getRecentPosts,
  getRecentUsers,
  getAllUsers,
  deleteUser,
  updateUserRole
};