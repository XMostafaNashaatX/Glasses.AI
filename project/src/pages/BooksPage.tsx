import React from 'react';
import { SearchBar } from '../components/books/SearchBar';
import { BookCard } from '../components/books/BookCard';
import type { Book } from '../types';

const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    price: 19.99,
    rating: 4.8,
    description: 'A classic novel about the American Dream',
    genre: ['Fiction', 'Classic'],
    reviews: []
  },
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    price: 19.99,
    rating: 4.8,
    description: 'A classic novel about the American Dream',
    genre: ['Fiction', 'Classic'],
    reviews: []
  },
  // Add more sample books...
];

export function BooksPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState('');

  const filteredBooks = SAMPLE_BOOKS.filter((book) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    switch (filter) {
      case 'title':
        return book.title.toLowerCase().includes(query);
      case 'author':
        return book.author.toLowerCase().includes(query);
      case 'genre':
        return book.genre.some(g => g.toLowerCase().includes(query));
      default:
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.genre.some(g => g.toLowerCase().includes(query))
        );
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SearchBar
        onSearch={setSearchQuery}
        onFilterChange={setFilter}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}