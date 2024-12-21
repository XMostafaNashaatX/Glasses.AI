import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookCard } from '../books/BookCard';

interface Book {
  id: number;
  title: string;
  author: string;
  price: string;
  image_url_l: string;
}

export function RecommendedBooks() {
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authToken = localStorage.getItem('access');

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      if (!authToken) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/recommendtion/recommend/', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setRecommendedBooks(response.data.recommendations);
      } catch (error: any) {
        setError(error.response ? error.response.data.detail : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedBooks();
  }, [authToken]);

  if (loading) return <div>Loading recommended books...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
