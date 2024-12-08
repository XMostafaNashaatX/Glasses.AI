import React from 'react';
import { useParams } from 'react-router-dom';
import { BookDetails } from '../components/books/BookDetails';
import type { Book } from '../types';

// This would typically come from an API
const SAMPLE_BOOK: Book = {
  id: '1',
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
  price: 19.99,
  rating: 4.8,
  description: 'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
  genre: ['Fiction', 'Classic'],
  reviews: []
};

export function BookDetailsPage() {
  const { id } = useParams();
  // In a real app, we would fetch the book data based on the ID
  const book = SAMPLE_BOOK;

  if (!book) {
    return <div>Book not found</div>;
  }

  return <BookDetails book={book} />;
}