import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Newspaper, LogIn, LogOut, UserCircle, Menu, X, Settings, Layers } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, isAdmin, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Newspaper className="h-8 w-8" />
            <span className="text-xl font-bold">Blog</span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition duration-200">Home</Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="hover:text-blue-200 transition duration-200">
                    Dashboard
                  </Link>
                )}

                <div className="relative" ref={profileMenuRef}>
                  <button 
                    className="flex items-center space-x-1 hover:text-blue-200 transition duration-200"
                    onClick={toggleProfileMenu}
                  >
                    <span>{user?.name || 'User'}</span>
                    <UserCircle size={20} />
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setIsProfileMenuOpen(false)}>
                        Profile
                      </Link>
                      {isAdmin && (
                        <Link to="/my-posts" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setIsProfileMenuOpen(false)}>
                          My Posts
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 hover:text-blue-200 transition duration-200"
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <>
                      <Link 
                        to="/admin/dashboard" 
                        className="px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings size={18} />
                        <span>Dashboard</span>
                      </Link>
                      <Link 
                        to="/admin/posts" 
                        className="px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Layers size={18} />
                        <span>Manage Posts</span>
                      </Link>
                    </>
                  )}
                  <Link 
                    to="/profile" 
                    className="px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircle size={18} />
                    <span>{user?.name || 'Profile'}</span>
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/my-posts" 
                      className="px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Posts
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-left"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-white text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
