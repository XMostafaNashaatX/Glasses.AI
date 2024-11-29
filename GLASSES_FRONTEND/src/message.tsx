import React, { useState, useEffect } from 'react';
import './Login.css';
import googleIcon from './assets/google-icon-logo-svgrepo-com.svg';
import facebookIcon from './assets/facebook-svgrepo-com.svg';

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/csrf/', {
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrf_token);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSignUpClick = () => setIsSignUp(true);
  const handleSignInClick = () => setIsSignUp(false);

  // Handle login
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Login successful');
        console.log('CSRF Token:', data.csrf_token);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  };

  // Handle sign-up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/users/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        alert('Sign-up successful! You can now log in.');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Sign-up failed');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('An error occurred during sign-up');
    }
  };

  const handleGoogleClick = () => {
    window.open(
      'https://accounts.google.com/o/oauth2/auth?' +
      new URLSearchParams({
        client_id: '377073767201-tfl7ct48pr7s06k8pn2gcbuoi1irhf1b.apps.googleusercontent.com',
        scope: 'email profile',
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
      }).toString(),
      '_self'
    );
  };

  const handleFacebookClick = () => {
    window.open(
      'https://www.facebook.com/v3.3/dialog/oauth?' +
      new URLSearchParams({
        client_id: 'YOUR_FACEBOOK_CLIENT_ID',
        redirect_uri: 'http://localhost:3000',
        scope: 'email',
        response_type: 'code',
      }).toString(),
      '_self'
    );
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social" onClick={handleGoogleClick}>
              <img src={googleIcon} alt="Google" style={{ width: '4em', height: '3.5em' }} />
            </a>
            <a href="#" className="social" onClick={handleFacebookClick}>
              <img src={facebookIcon} alt="Facebook" style={{ width: '4em', height: '3.5em' }} />
            </a>
          </div>
          <span>or use your email for registration</span>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={handleSignInSubmit}>
          <h1>Sign in</h1>
          <div className="social-container" style={{ marginBottom: '10px' }}>
            <a href="#" className="social" onClick={handleGoogleClick}>
              <img src={googleIcon} alt="Google" style={{ width: '4em', height: '3.5em' }} />
            </a>
            <a href="#" className="social" onClick={handleFacebookClick}>
              <img src={facebookIcon} alt="Facebook" style={{ width: '4em', height: '3.5em' }} />
            </a>
          </div>
          <span>or use your account</span>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={handleSignInClick}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Welcome to Glasses.AI!</h1>
            <p>Enter your personal details to start reviewing and discovering amazing books</p>
            <button className="ghost" onClick={handleSignUpClick}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
