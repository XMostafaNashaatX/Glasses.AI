import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchBar } from '../components/books/SearchBar';
import { BookCard } from '../components/books/BookCard';
import type { Book } from '../types';

export function BooksPage() {
  const [filter, setFilter] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');


  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/stores/books/all/');
      setBooks(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBooks();
  }, []);

  
  const filteredBooks = books.filter((book) => {
    if (!filter) return true;

    const query = filter.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.some((g) => g.toLowerCase().includes(query))
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SearchBar
        onBooksFetched={(fetchedBooks) => {
          if (fetchedBooks.length) {
            setBooks(fetchedBooks); 
            setError('');
          } else {
            fetchBooks(); 
          }
        }}
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
