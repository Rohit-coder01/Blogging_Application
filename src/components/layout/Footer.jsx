import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Newspaper className="h-7 w-7 text-blue-400" />
              <span className="text-xl font-bold">Blog</span>
            </div>
            <p className="text-gray-400 mb-4">
              Share your thoughts with the world. A place for ideas, stories, and creative expression.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/create-post" className="text-gray-400 hover:text-white transition-colors">Create Post</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Technology</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Travel</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Food</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Lifestyle</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Business</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400 mb-2">Have questions or feedback?</p>
            <a href="mailto:contact@blog.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              contact@blog.com
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;