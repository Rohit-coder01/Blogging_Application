import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { Edit, Trash2, Eye, MessageSquare, ThumbsUp, PenSquare } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch user's posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/posts/user');
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load your posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  // Handle post deletion
  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/posts/${id}`);
      setPosts(posts.filter(post => post._id !== id));
      setPostToDelete(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Posts</h1>
            <p className="text-gray-600">Manage all your blog posts</p>
          </div>
          <Link 
            to="/create-post"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PenSquare className="h-5 w-5 mr-2" />
            Create New Post
          </Link>
        </div>

        {/* Posts List */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-blue-600 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't created any posts yet.</p>
            <Link 
              to="/create-post"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PenSquare className="h-5 w-5 mr-2" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map(post => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                            {post.image ? (
                              <img 
                                src={post.image} 
                                alt={post.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400">No img</div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {post.content.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post.likes?.length || 0}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {post.comments?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            to={`/post/${post._id}`}
                            className="text-gray-500 hover:text-gray-700"
                            title="View"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link 
                            to={`/edit-post/${post._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button 
                            onClick={() => setPostToDelete(post)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the post "{postToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(postToDelete._id)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;