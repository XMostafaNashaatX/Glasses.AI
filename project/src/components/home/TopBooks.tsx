import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookCard } from '../books/BookCard';

interface Book {
  id: number;
  title: string;
  author: string;
  avg_rating: number;
}

export function TopBooks() {
  const [topBooks, setTopBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authToken = localStorage.getItem('access'); 

  
  useEffect(() => {
    const fetchTopBooks = async () => {
      if (!authToken) {
        setError('No auth token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/ratings/get_top_books', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setTopBooks(response.data);
      } catch (error: any) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, [authToken]);


  if (loading) return <div>Loading...</div>;


  if (error) return <div>Error: {error}</div>;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Top 10 Rated Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {topBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
