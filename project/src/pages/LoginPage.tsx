import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthLayout } from '../components/AuthLayout';
import axios from 'axios';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Make the POST request to the login API
      const response = await axios.post(
        'http://127.0.0.1:8000/users/api/token/',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Store the JWT token in localStorage
      const { access } = response.data;
      localStorage.setItem('access', access);

      // Set default Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Redirect to the profile page or any other page
      navigate('/profile');
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32]"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32]"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#5A1A32] hover:bg-[#4A1528] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A1A32] transition-colors"
        >
          Sign In
        </motion.button>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-[#5A1A32] hover:text-[#4A1528]">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
