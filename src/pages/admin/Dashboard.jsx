import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

import { 
  BarChart, 
  Users, 
  Layers, 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  Activity, 
  Newspaper, 
  User 
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get dashboard stats  
        const statsResponse = await axios.get('/api/admin/stats');
        setStats(statsResponse.data);
        
        // Get recent posts
        const postsResponse = await axios.get('/api/admin/posts/recent');
        setRecentPosts(postsResponse.data);
        
        // Get recent users
        const usersResponse = await axios.get('/api/admin/users/recent');
        setRecentUsers(usersResponse.data);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Posts */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Newspaper className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Posts</p>
            <p className="text-2xl font-bold text-gray-800">{stats?.totalPosts || 0}</p>
          </div>
        </div>
        
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
          </div>
        </div>
        
        {/* Total Comments */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <MessageSquare className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Comments</p>
            <p className="text-2xl font-bold text-gray-800">{stats?.totalComments || 0}</p>
          </div>
        </div>
        
        {/* Total Likes */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="rounded-full bg-pink-100 p-3 mr-4">
            <ThumbsUp className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Likes</p>
            <p className="text-2xl font-bold text-gray-800">{stats?.totalLikes || 0}</p>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/posts/create"
            className="flex items-center justify-center space-x-2 p-4 border border-blue-200 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Post</span>
          </Link>
          
          <Link 
            to="/admin/posts"
            className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
          >
            <Layers className="h-5 w-5" />
            <span>Manage Posts</span>
          </Link>
          
          <Link 
            to="/admin/users"
            className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
          >
            <Users className="h-5 w-5" />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Posts */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Recent Posts</h2>
            <Link 
              to="/admin/posts"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentPosts.length > 0 ? (
              recentPosts.map(post => (
  <div key={post._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
    <div className="flex justify-between items-start">
      <div className="flex items-start gap-4">
        <img
          src={post.image || "/images/default.jpg"}
          alt={post.title || "Default blog post"}
          className="w-20 h-16 object-cover rounded"
        />
        <div>
          <Link 
            to={`/post/${post._id}`}
            className="font-medium text-gray-900 hover:text-blue-600"
          >
            {post.title}
          </Link>
          <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {post.author.name}
            </span>
            <span className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {post.comments?.length || 0}
            </span>
            <span className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {post.likes?.length || 0}
            </span>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      </div>
    </div>
  </div>
))
            ) : (
              <p className="text-gray-500 text-center py-4">No posts yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;