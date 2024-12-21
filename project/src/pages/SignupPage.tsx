import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthLayout } from '../components/AuthLayout';

export function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    middleName: '',
    password: '',
    confirm_password: '',  // Changed here
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the JWT token from localStorage
    const token = localStorage.getItem('access');

    // Set up the headers with the Authorization token
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };

    // API request to sign up
    try {
      const response = await fetch('http://127.0.0.1:8000/users/signup/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // If signup is successful, navigate to profile page
        navigate('/profile');
      } else {
        // Handle errors here
        const data = await response.json();
        console.error('Signup failed:', data);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Optionally show an error message to the user
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32]"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32]"
            />
          </div>
        </div>
        <div>
          <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
            Middle Name (Optional)
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            name="middleName"
            id="middleName"
            value={formData.middleName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32]"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32]"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
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
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32]"
          />
        </div>
        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="password"
            name="confirm_password"  // Changed here
            id="confirm_password"     // Changed here
            value={formData.confirm_password}  // Changed here
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32]"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#5A1A32] hover:bg-[#4A1528] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A1A32] transition-colors"
        >
          Sign Up
        </motion.button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#5A1A32] hover:text-[#4A1528]">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}