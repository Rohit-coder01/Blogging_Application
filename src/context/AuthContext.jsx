import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token exists and is valid on app startup
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user')); // Fetch the user from localStorage
        const storedIsAdmin = localStorage.getItem('isAdmin') === 'true'; // Fetch isAdmin from localStorage

        if (token && storedUser) {
          // Verify token hasn't expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token expired
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('user'); // Remove user data from localStorage
            setIsAuthenticated(false);
            setUser(null);
            setIsAdmin(false);
          } else {
            // Valid token
            setUser(storedUser); // Set user from localStorage
            setIsAdmin(storedIsAdmin); // Set isAdmin from localStorage
            setIsAuthenticated(true);

            // Set auth header for all future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        } else {
          // If no token or user data in localStorage, reset state
          setIsAdmin(storedIsAdmin);
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('user');
        setError('Authentication error. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const { token, user } = response.data;

      // Save token, role, and user data
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', user.isAdmin.toString()); // Store isAdmin in localStorage
      localStorage.setItem('user', JSON.stringify(user)); // Store user object in localStorage

      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Update state
      setUser(user);
      setIsAdmin(user.isAdmin || false);
      setIsAuthenticated(true);

      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('http://localhost:5000/api/users/register', { name, email, password });
      const { token, user } = response.data;

      // Save token, role, and user data
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', user.isAdmin.toString()); // Store isAdmin in localStorage
      localStorage.setItem('user', JSON.stringify(user)); // Store user object in localStorage

      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Update state
      setUser(user);
      setIsAdmin(user.isAdmin || false);
      setIsAuthenticated(true);

      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin'); // Remove isAdmin from localStorage
    localStorage.removeItem('user'); // Remove user data from localStorage
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAdmin(false);
    setIsAuthenticated(false);
  };

  // Clear any error messages
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
