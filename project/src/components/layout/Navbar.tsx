import React from 'react';
import { Link } from 'react-router-dom';
import { Book, ShoppingCart, Home, BookOpen, Menu, X } from 'lucide-react';
import { UserNav } from './UserNav';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-[#5A1A32] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Book className="h-6 w-6" />
              <span className="font-bold text-xl">Glasses.AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-1 hover:text-[#A8A8AA]">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/books" className="flex items-center space-x-1 hover:text-[#A8A8AA]">
              <BookOpen className="h-4 w-4" />
              <span>Books</span>
            </Link>
            <Link to="/genres" className="hover:text-[#A8A8AA]">Genres</Link>
            <Link to="/cart" className="flex items-center space-x-1 hover:text-[#A8A8AA]">
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <UserNav />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 hover:bg-[#A8A8AA] rounded-md">Home</Link>
            <Link to="/books" className="block px-3 py-2 hover:bg-[#A8A8AA] rounded-md">Books</Link>
            <Link to="/genres" className="block px-3 py-2 hover:bg-[#A8A8AA] rounded-md">Genres</Link>
            <Link to="/cart" className="block px-3 py-2 hover:bg-[#A8A8AA] rounded-md">Cart</Link>
            <div className="px-3 py-2">
              <UserNav />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}