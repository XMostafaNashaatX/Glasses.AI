import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Author {
  id: string;
  author: string;
  avg_rating: number;
  books_count: number;
  photo: string;
}

export function TopAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authToken = localStorage.getItem('access'); 

  useEffect(() => {
    const fetchTopAuthors = async () => {
      if (!authToken) {
        setError('No auth token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/ratings/get_top_authors/', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setAuthors(response.data); 
      } catch (error: any) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopAuthors();
  }, [authToken]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Top 10 Rated Authors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {authors.map((author, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={author.photo || 'https://via.placeholder.com/150'} // Fallback to placeholder if no photo
              alt={author.author}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold text-center">{author.author}</h3>
            <div className="text-center text-gray-600">
              <p>Average Rating: {author.avg_rating.toFixed(1)}/5</p>
              <p>{author.books_count} books published</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
