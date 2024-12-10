import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Book } from '../../types';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { dispatch: cartDispatch } = useCart();
  const { state: favoritesState, dispatch: favoritesDispatch } = useFavorites();

  const isFavorite = favoritesState.items.some(item => item.id === book.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the cart button
    cartDispatch({ type: 'ADD_TO_CART', payload: book });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the favorite button
    if (isFavorite) {
      favoritesDispatch({ type: 'REMOVE_FROM_FAVORITES', payload: book.id });
    } else {
      favoritesDispatch({ type: 'ADD_TO_FAVORITES', payload: book });
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
      <Link to={`/books/${book.id}`}>
        {/* Use image_url_s or fallback */}
        <img
          src={book.image_url_l || 'https://via.placeholder.com/150'} // Fallback image
          alt={book.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold truncate">{book.title}</h3>
            <p className="text-gray-600 text-sm">{book.author}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">{book.rating}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-[#5A1A32] font-bold">${book.price}</span>
          <div className="flex space-x-2">
            <button
              onClick={handleToggleFavorite}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-[#5A1A32]'}`}
              />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ShoppingCart className="h-5 w-5 text-[#5A1A32]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
