import React, { useEffect, useState } from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import axios from 'axios';
import type { Book } from '../../types';
import { Trash } from 'lucide-react'; 

interface BookDetailsProps {
  book: Book;
}

export function BookDetails({ book }: BookDetailsProps) {
  const [score, setRating] = useState(0); // For new rating input
  const [review, setReview] = useState('');
  const [userRatingForBook, setUserRatingForBook] = useState<number | null>(null); // User's rating for the book
  const { dispatch: cartDispatch } = useCart();
  const { state: favoritesState, dispatch: favoritesDispatch } = useFavorites();

  const isFavorite = favoritesState.items.some(item => item.id === book.id);
  const authToken = localStorage.getItem('access'); // Get the JWT authentication token from localStorage

  // Fetch the user's specific rating for the book
  useEffect(() => {
    if (authToken) {
      fetch(`http://127.0.0.1:8000/ratings/book/${book.id}/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserRatingForBook(data.user_rating || null); // Set user's rating if it exists
        })
        .catch(() => setUserRatingForBook(null)); // In case of error, set userRatingForBook as null
    }
  }, [book.id, authToken]);


  const handleAddToCart = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/cart/add/',
        { book_id: book.id },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      cartDispatch({ type: 'ADD_TO_CART', payload: { book , quantity: 1 } });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToFavorites = async () => {
    if (!authToken) {
      alert('You must be logged in to add to favorites.');
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/favourite_list/add/`,
        { books: [{ book_id: book.id }] },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      favoritesDispatch({ type: 'ADD_TO_FAVORITES', payload: book });
      //alert('Book added to favorites.');
    } catch (error: any) {
      console.error('Error adding to favorites:', error.response?.data || error.message);
      alert('An error occurred while adding to favorites.');
    }
  };

  const removeFromFavorites = async () => {
    if (!authToken) {
      alert('You must be logged in to remove from favorites.');
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/favourite_list/remove/${book.id}/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      favoritesDispatch({ type: 'REMOVE_FROM_FAVORITES', payload: book.id });
      //alert('Book removed from favorites.');
    } catch (error: any) {
      console.error('Error removing from favorites:', error.response?.data || error.message);
      alert('An error occurred while removing from favorites.');
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites();
    } else {
      addToFavorites();
    }
  };
  

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authToken) {
      alert("You must be logged in to submit a rating.");
      return;
    }

    if (score === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    const url = userRatingForBook === null
      ? `http://127.0.0.1:8000/ratings/create/${book.id}/`
      : `http://127.0.0.1:8000/ratings/update/${book.id}/`;

    const method = userRatingForBook === null ? 'POST' : 'PUT';

    try {
      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        data: { score, review },
      });

      setUserRatingForBook(response.data.user_rating);

      setRating(0);
      setReview('');
    } catch (error) {
      alert("Error submitting review. Please try again.");
    }
  };

  const handleDeleteRating = async () => {
    if (!authToken) {
      alert("You must be logged in to delete a rating.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/ratings/delete/${book.id}/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Clear the user's rating
      setUserRatingForBook(null);
    } catch (error) {
      alert("Error deleting review. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={book.image_url_l || book.image_url_m || book.image_url_s}
            alt={book.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">{book.author}</p>

          {/* Display categories */}
          <div className="text-2xl font-semibold mb-4">
            <strong className="text-black">Categories:</strong>
            <div className="flex flex-wrap gap-3 mt-3">
              {book.categories.map((category: string, index: number) => (
                <span
                  key={index}
                  className="bg-[#5A1A32] text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center mb-4">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="ml-1 text-lg">
              {userRatingForBook !== null ? `Your Rating: ${userRatingForBook}` : 'No ratings yet'}
            </span>
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
              onClick={toggleFavorite}
              className={`border p-2 rounded-lg ${
                isFavorite
                  ? 'bg-[#5A1A32] text-white'
                  : 'bg-[#5A1A32] text-white hover:bg-[#5A1A32]/90'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? '' : ''}</span>
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
                      className={`p-1 ${score >= star ? 'text-yellow-400' : 'text-gray-300'}`}
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
                className="bg-[#5A1A32] text-white px-6 py-2 rounded-lg hover:bg-[#5A1A32]/90 z-10"
              >
                Submit Review
              </button>
            </form>

            {userRatingForBook !== null && (
              <div className="mt-4">
                <button
                  onClick={handleDeleteRating}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-400 flex items-center justify-center z-0"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
