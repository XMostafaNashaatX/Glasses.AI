import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/users/api/token/",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Store the JWT token
      const { access } = response.data;
      localStorage.setItem("access", access);
      console.log(localStorage.getItem("access"));

      // Set default Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      // Redirect to the home page or a specific page
      navigate("/books");
    } catch (err) {
      setError("Invalid username or password");
      console.error("Login error:", err);
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
