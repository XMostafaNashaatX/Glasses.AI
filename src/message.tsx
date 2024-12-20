// src/message.tsx
import React, { useEffect, useState } from "react";
import "./Login.css";
import googleIcon from "./assets/google-icon-logo-svgrepo-com.svg";
import facebookicon from "./assets/facebook-svgrepo-com.svg";
import Book1 from "./assets/book-education-study-svgrepo-com.png";
import Book2 from "./assets/book-opened-svgrepo-com.png";
import Book3 from "./assets/book-svgrepo-com.png";
import bookOpeningGif from "./assets/book-opening.gif"; // Import your GIF

const LoginPage = () => {
  const [showForm, setShowForm] = useState(false); // State to control form visibility

  useEffect(() => {
    // Set a timer to show the form after the GIF animation ends
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 3000); // Adjust duration to match your GIF length (in milliseconds)

    return () => clearTimeout(timer);
  }, []);

  const handleGoogleLogin = () => {
    console.log("Google login clicked!");
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
    <>
      <canvas id="backgroundCanvas"></canvas>
      <div className="gif-container">
        {!showForm && (
          <img src={bookOpeningGif} alt="Opening Animation" className="intro-gif" />
        )}
      </div>
      <div className="login-container">
        {showForm ? (
          <>
            <h1>Welcome to Glasses.AI</h1>
            <p>Discover, review, and love your favorite books</p>
            <form className="login-form">
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <button type="submit" className="submit-button">
                Login
              </button>
            </form>
            <div className="divider">OR</div>
            <div className="button-container">
              <button className="google-login" onClick={handleGoogleLogin}>
                <img src={googleIcon} alt="Google Logo" />
                Login with Google
              </button>
              <button className="facebook-login" onClick={handleFacebookLogin}>
                <img src={facebookicon} alt="Facebook Logo" />
                Login with Facebook
              </button>
            </div>
            <p>
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default LoginPage;
