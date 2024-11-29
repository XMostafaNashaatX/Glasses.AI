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

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked!");
  };

  useEffect(() => {
    const canvas = document.getElementById("backgroundCanvas") as HTMLCanvasElement;
    if (!canvas) {
      console.error("Canvas not found!");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context not available!");
      return;
    }

    const bookImages: HTMLImageElement[] = [];
    const books = ["wired-lineal-112-book-hover-closed (1).png", "wired-lineal-112-book-hover-closed.png","wired-lineal-112-book-hover-closed (2).png"]; // Replace with your image filenames
    let loadedImages = 0;

    const particles: { x: number; y: number; size: number; dx: number; dy: number; imageIndex: number }[] = [];
    let mouseX = -100;
    let mouseY = -100;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Load book images
    books.forEach((book, index) => {
      const img = new Image();
      img.src = `/assets/${book}`; // Update path to where your images are stored
      img.onload = () => {
        loadedImages++;
        if (loadedImages === books.length) {
          createParticles(100); // Start once all images are loaded
          animate();
        }
      };
      bookImages[index] = img;
    });

    const createParticles = (count: number) => {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 40 + 30, // Random size for books
          dx: (Math.random() - 0.5) * 2,
          dy: (Math.random() - 0.5) * 2,
          imageIndex: Math.floor(Math.random() * bookImages.length),
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        const img = bookImages[particle.imageIndex];
        ctx.drawImage(img, particle.x, particle.y, particle.size, particle.size);
      });
    };

    const updateParticles = () => {
      particles.forEach((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Particle attraction towards the cursor
        const distX = particle.x - mouseX;
        const distY = particle.y - mouseY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < 150) {
          particle.dx += distX / 1500;
          particle.dy += distY / 1500;
        }

        // Bounce particles off the edges
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -0.8;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -0.8;
      });
    };

    const animate = () => {
      drawParticles();
      updateParticles();
      requestAnimationFrame(animate);
    };

    // Mousemove event listener
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize event listener
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

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
