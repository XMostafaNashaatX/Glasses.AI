import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { BooksPage } from './pages/BooksPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { CartPage } from './pages/CartPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';
import SpotifyConnect from './pages/SpotifyConnect';
import Genres from './pages/Genres';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Replace this with your actual Stripe public key
const stripePromise = loadStripe('pk_test_51QYTefC1eVNOye6PYXquDZz450NwDfnubpixWq25PrVbVmHUzxifrDt5aGyB0oU0HB0BvXUoMOmX1WKH8bfVhG5u00wmrUwikJ');

function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Router>
          <div className="min-h-screen bg-[#A8A8AA]/10">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/:id" element={<BookDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              {/* Wrap the CheckoutPage in the Elements provider */}
              <Route
                path="/checkout"
                element={
                  <Elements stripe={stripePromise}>
                    <CheckoutPage />
                  </Elements>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/spotify" element={<SpotifyConnect />} />
              <Route path="/genres" element={<Genres />} />
            </Routes>
          </div>
        </Router>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;
