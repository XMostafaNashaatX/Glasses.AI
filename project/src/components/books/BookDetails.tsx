import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import type { Book } from '../../types';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

interface BookDetailsProps {
  book: Book;
}

export function BookDetails({ book }: BookDetailsProps) {
  const [rating, setRating] = React.useState(0);
  const [review, setReview] = React.useState('');
  const { dispatch: cartDispatch } = useCart();
  const { state: favoritesState, dispatch: favoritesDispatch } = useFavorites();

  const isFavorite = favoritesState.items.some(item => item.id === book.id);

  const handleAddToCart = () => {
    cartDispatch({ type: 'ADD_TO_CART', payload: book });
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      favoritesDispatch({ type: 'REMOVE_FROM_FAVORITES', payload: book.id });
    } else {
      favoritesDispatch({ type: 'ADD_TO_FAVORITES', payload: book });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Add review submission logic
    setRating(0);
    setReview('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={book.cover}
            alt={book.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">{book.author}</p>
          
          <div className="flex items-center mb-4">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="ml-1 text-lg">{book.rating} / 5</span>
          </div>
          
          <p className="text-gray-700 mb-6">{book.description}</p>
          
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-2xl font-bold text-[#5A1A32]">${book.price}</span>
            <button 
              onClick={handleAddToCart}
              className="bg-[#5A1A32] text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#5A1A32]/90"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
            <button 
              onClick={handleToggleFavorite}
              className={`border border-[#5A1A32] p-2 rounded-lg ${
                isFavorite 
                  ? 'bg-[#5A1A32] text-white' 
                  : 'text-[#5A1A32] hover:bg-[#5A1A32] hover:text-white'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1A32]"
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="bg-[#5A1A32] text-white px-6 py-2 rounded-lg hover:bg-[#5A1A32]/90"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}