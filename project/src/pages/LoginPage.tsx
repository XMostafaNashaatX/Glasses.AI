import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function LoginPage() {
  const [csrfToken, setCsrfToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Fetch CSRF Token from the backend
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/csrf/', {
          withCredentials: true, // Include cookies
        });
        setCsrfToken(response.data.csrf_token);
        localStorage.setItem('csrfToken', response.data.csrf_token); // Store token for later use
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/users/login/',
        { username, password },
        {
          headers: {
            'X-CSRFToken': csrfToken, // Include the CSRF token in the header
          },
          withCredentials: true, // Include cookies
        }
      );

      // Store tokens and handle redirection after login
      if (response.data.access) {
        localStorage.setItem('authToken', response.data.access); // Store JWT token
        if (response.data.redirect_to) {
          window.location.href = response.data.redirect_to;
        }
      }
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="bg-white p-6 rounded-md shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border rounded-md"
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">
            Sign In
          </button>
        </form>
      </section>
    </div>
  );
}
