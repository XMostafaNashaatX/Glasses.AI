import React, { useState } from 'react';
import './Login.css';
import googleIcon from './assets/google-icon-logo-svgrepo-com.svg'; // Import Google SVG
import facebookIcon from './assets/facebook-svgrepo-com.svg'; // Import Facebook SVG

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  // Handle form submission for sign-in
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the login request to the backend
    try {
      const response = await fetch('https://your-backend-url.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // The backend should return the token
        localStorage.setItem('authToken', token); // Store the token in localStorage
        alert('Login successful');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred');
    }
  };

  // Handle form submission for sign-up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the sign-up request to the backend
    try {
      const response = await fetch('https://your-backend-url.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // The backend should return the token
        localStorage.setItem('authToken', token); // Store the token in localStorage
        alert('Sign Up successful');
      } else {
        alert('Sign Up failed');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('An error occurred');
    }
  };

  const handleGoogleClick = async () => {
    // Redirect the user to Google Login
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

  const handleFacebookClick = async () => {
    // Redirect the user to Facebook Login
    window.open(
      'https://www.facebook.com/v3.3/dialog/oauth?' +
        new URLSearchParams({
          client_id: 'YOUR_FACEBOOK_CLIENT_ID',
          redirect_uri: 'http://localhost:3000',
          scope: 'email',
          response_type: 'code',
          access_type: 'offline',
          prompt: 'consent',
        }).toString(),
      '_self'
    );
  };

  const handleForgotPassword = () => {
    // Redirect to password recovery page or open modal
    alert('Redirecting to password recovery...');
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
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <a href="#" onClick={handleForgotPassword}>Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Welcome to Glasses.AI!</h1>
            <p>Enter your personal details to start reviewing and discovering amazing books</p>
            <button className="ghost" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
      <footer></footer>
    </div>
  );
};

export default AuthForm;