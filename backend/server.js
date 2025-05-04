import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Middleware
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Config
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(cors());
app.use(express.json());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/blogapp')
  .then(() => {
    console.log('MongoDB connected successfully');
    
    // Start server after DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});