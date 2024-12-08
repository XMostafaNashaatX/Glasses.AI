import React from 'react';
import { BookCard } from '../components/books/BookCard';
import { useFavorites } from '../context/FavoritesContext';

export function FavoritesPage() {
  const { state } = useFavorites();

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Favorites List is Empty</h2>
        <p className="text-gray-600">Start adding books to your favorites!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Your Favorites</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {state.items.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}