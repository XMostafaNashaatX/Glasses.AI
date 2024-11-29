// src/Signup.tsx
import React, { useEffect } from "react";
import "./Signup.css";
import googleIcon from "./assets/google-icon-logo-svgrepo-com.svg";
import facebookicon from "./assets/facebook-svgrepo-com.svg";
import Book1 from "./assets/book-education-study-svgrepo-com.png";
import Book2 from "./assets/book-opened-svgrepo-com.png";
import Book3 from "./assets/book-svgrepo-com.png";

const SignupPage = () => {
  const handleGoogleSignup = () => {
    console.log("Google signup clicked!");
  };

  const handleFacebookSignup = () => {
    console.log("Facebook signup clicked!");
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
    const books = ["wired-lineal-112-book-hover-closed (1).png", "wired-lineal-112-book-hover-closed.png","wired-lineal-112-book-hover-closed (2).png"];
    let loadedImages = 0;

    const particles: { x: number; y: number; size: number; dx: number; dy: number; imageIndex: number }[] = [];
    let mouseX = -100;
    let mouseY = -100;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    books.forEach((book, index) => {
      const img = new Image();
      img.src = `/assets/${book}`;
      img.onload = () => {
        loadedImages++;
        if (loadedImages === books.length) {
          createParticles(100);
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
          size: Math.random() * 40 + 30,
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

        const distX = particle.x - mouseX;
        const distY = particle.y - mouseY;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < 150) {
          particle.dx += distX / 1500;
          particle.dy += distY / 1500;
        }

        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -0.8;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -0.8;
      });
    };

    const animate = () => {
      drawParticles();
      updateParticles();
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas id="backgroundCanvas"></canvas>
      <div className="login-container">
        <h1>Join Glasses.AI</h1>
        <p>Start your journey of discovering amazing books</p>
        <form className="login-form">
          <input type="email" placeholder="Email Address" required />
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>
        <div className="divider">OR</div>
        <div className="button-container">
          <button className="google-login" onClick={handleGoogleSignup}>
            <img src={googleIcon} alt="Google Logo" />
            Sign Up with Google
          </button>
          <button className="facebook-login" onClick={handleFacebookSignup}>
            <img src={facebookicon} alt="Facebook Logo" />
            Sign Up with Facebook
          </button>
        </div>
        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </>
  );
};

export default SignupPage;
