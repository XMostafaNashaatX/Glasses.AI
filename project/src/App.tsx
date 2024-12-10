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
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>
        </Router>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;
