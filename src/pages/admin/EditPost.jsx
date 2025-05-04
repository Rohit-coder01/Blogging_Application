import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/posts/${id}`);
        const post = response.data;

        setTitle(post.title);
        setContent(post.content); // keep HTML content for editor
        setCategory(post.category);
        if (post.image) {
          setCurrentImage(post.image);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. It may have been deleted or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setCurrentImage('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !category.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content); // HTML-rich content
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.put(`/api/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate(`/post/${response.data._id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ header: 1 }, { header: 2 }, 'blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }, { align: [] }],
      ['link', 'image', 'video', 'formula'],
      ['clean'],
    ],
  };

  const categories = [
    'Technology', 'Travel', 'Food', 'Lifestyle', 'Business',
    'Health', 'Science', 'Arts', 'Education', 'Politics', 'Sports'
  ];

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Post</h1>
          <p className="text-gray-600">Update your blog post content and details</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a compelling title for your post"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <div className="flex items-center space-x-4">
                <label className="block">
                  <span className="sr-only">Choose file</span>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                    "
                  />
                </label>

                {(imagePreview || currentImage) && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview('');
                      setCurrentImage('');
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              {imagePreview ? (
                <div className="mt-2 w-full h-40 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : currentImage ? (
                <div className="mt-2 w-full h-40 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={currentImage}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              <p className="mt-1 text-sm text-gray-500">
                Maximum file size: 5MB. Recommended dimensions: 1200x630px
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                theme="snow"
                placeholder="Write your post content here..."
                className="bg-white"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
