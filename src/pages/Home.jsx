import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, User, Tag, Search, ChevronRight, ThumbsUp } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Helper to strip HTML tags
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/posts');
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      stripHtml(post.content).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === '' || post.category === categoryFilter;

    return matchesSearch && matchesCategory;
  }) : [];

  const categories = [...new Set(Array.isArray(posts) ? posts.map(post => post.category) : [])];

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to BlogWorld</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover stories, ideas, and expertise from writers on any topic
          </p>
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                categoryFilter === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setCategoryFilter('')}
            >
              All
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  categoryFilter === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No posts found matching your criteria.</p>
            {(searchTerm || categoryFilter) && (
              <button
                className="mt-4 text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image || 'https://via.placeholder.com/640x360?text=Blog+Post'} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                      {post.category}
                    </span>
                    <span className="flex items-center mr-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {stripHtml(post.content).substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/post/${post._id}`}
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Read more
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;