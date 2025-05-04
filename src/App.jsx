import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Public Pages
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';

// Protected Pages
import Dashboard from './pages/admin/Dashboard';
import ManagePosts from './pages/admin/ManagePosts';
import EditPost from './pages/admin/EditPost';
import CreatePost from './pages/admin/CreatePost';
import UserProfile from './pages/user/UserProfile';
import UserPosts from './pages/user/UserPosts';
import CreateUserPost from './pages/user/CreateUserPost';

// Utilities
import ProtectedRoute from './components/utils/ProtectedRoute';
import AdminRoute from './components/utils/AdminRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/post/:id" element={<BlogPost />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/posts" 
                element={
                  <AdminRoute>
                    <ManagePosts />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/posts/create" 
                element={
                  <AdminRoute>
                    <CreatePost />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/posts/edit/:id" 
                element={
                  <AdminRoute>
                    <EditPost />
                  </AdminRoute>
                } 
              />
              
              {/* User Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-posts" 
                element={
                  <ProtectedRoute>
                    <UserPosts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-post" 
                element={
                  <ProtectedRoute>
                    <CreateUserPost />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;