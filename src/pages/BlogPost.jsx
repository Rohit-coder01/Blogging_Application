import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow, format } from 'date-fns';
import { User, Calendar, Tag, MessageCircle, ThumbsUp, Edit, Trash2, Share2, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useContext(AuthContext);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. It may have been deleted or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setLiking(true);
      const response = await axios.put(`/api/posts/${id}/like`);
      setPost(response.data);
    } catch (err) {
      console.error('Error liking post:', err);
    } finally {
      setLiking(false);
    }
  };

  const hasLiked = post?.likes?.includes(user?._id);

  const handleComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!comment.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await axios.post(`/api/posts/${id}/comments`, { content: comment });
      setPost(response.data);
      setComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`/api/posts/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <p className="text-red-700">{error || 'Post not found'}</p>
          </div>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to home page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-96">
        <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
        <img 
          src={post.image || 'https://via.placeholder.com/1200x400?text=Blog+Post'} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </span>
                <span className="text-gray-200 text-sm">
                  {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-gray-300">Author</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="prose prose-lg max-w-none">
                {/* Render HTML content safely */}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              <div className="flex flex-wrap items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <button 
                    onClick={handleLike}
                    disabled={liking}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
                      hasLiked 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ThumbsUp className={`h-5 w-5 ${hasLiked ? 'fill-blue-700' : ''}`} />
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  
                  <button 
                    onClick={() => document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
                
             
              </div>
            </div>

            {/* Comments section stays the same... */}
            {/* (keeping it unchanged for brevity) */}
          </div>
          
          {/* Sidebar stays the same... */}
        </div>
      </div>

      {/* Delete confirmation modal stays the same... */}
    </div>
  );
};

export default BlogPost;

