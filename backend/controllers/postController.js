import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  
  // Check required fields
  if (!title || !content || !category) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  // Handle image upload
  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  // Create post
  const post = await Post.create({
    title,
    content,
    category,
    image: imagePath,
    author: req.user._id
  });

  // Populate author info
  const populatedPost = await Post.findById(post._id).populate('author', 'name email');

  res.status(201).json(populatedPost);
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
  
  res.json(posts);
});

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name email bio')
    .populate('comments.user', 'name');
  
  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if user is post author or admin
  if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this post');
  }

  // Handle image upload
  let imagePath = post.image;
  if (req.file) {
    // Delete old image if exists
    if (post.image) {
      const oldImagePath = path.join(__dirname, '../..', post.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    // Set new image path
    imagePath = `/uploads/${req.file.filename}`;
  }

  // Update post
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  post.category = req.body.category || post.category;
  post.image = imagePath;

  const updatedPost = await post.save();
  
  res.json(updatedPost);
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if user is post author or admin
  if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this post');
  }

  // Delete image if exists
  if (post.image) {
    const imagePath = path.join(__dirname, '../..', post.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await post.deleteOne();
  
  res.json({ message: 'Post removed' });
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
const commentPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    res.status(400);
    throw new Error('Comment cannot be empty');
  }

  const post = await Post.findById(req.params.id);
  
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Add comment
  post.comments.push({
    content,
    user: req.user._id
  });

  await post.save();
  
  // Return updated post with populated comments
  const updatedPost = await Post.findById(req.params.id)
    .populate('author', 'name email')
    .populate('comments.user', 'name');
  
  res.json(updatedPost);
});

// @desc    Like/unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if user already liked the post
  const alreadyLiked = post.likes.find(
    userId => userId.toString() === req.user._id.toString()
  );

  if (alreadyLiked) {
    // Unlike post
    post.likes = post.likes.filter(
      userId => userId.toString() !== req.user._id.toString()
    );
  } else {
    // Like post
    post.likes.push(req.user._id);
  }

  await post.save();
  
  // Return updated post
  const updatedPost = await Post.findById(req.params.id)
    .populate('author', 'name email')
    .populate('comments.user', 'name');
  
  res.json(updatedPost);
});

// @desc    Get posts by current user
// @route   GET /api/posts/user
// @access  Private
const getUserPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
  
  res.json(posts);
});

export {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  commentPost,
  likePost,
  getUserPosts
};