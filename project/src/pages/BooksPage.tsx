import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchBar } from '../components/books/SearchBar';
import { BookCard } from '../components/books/BookCard';
import type { Book } from '../types';

export function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/stores/books/all/');
        console.log(response.data)
        setBooks(response.data);
      } catch (error) {
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search query and selected filter
  const filteredBooks = books.filter((book) => {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SearchBar onSearch={setSearchQuery} onFilterChange={setFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
