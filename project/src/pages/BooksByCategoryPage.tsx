import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BookCard } from '../components/books/BookCard';

interface Book {
  id: number;
  title: string;
  author: string;
  price: string;
  image_url_l: string;
  year_publication: string;
  categories: string[];
}

export default function BooksByCategoryPage() {
  const { categoryId } = useParams(); // categoryId should match the URL param
  const [books, setBooks] = useState<Book[]>([]); // Adjust type as needed
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authToken = localStorage.getItem('access');  // Get the auth token from localStorage

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      if (!categoryId) {
        setError('Category ID is missing.');
        setLoading(false);
        return;
      }

      if (!authToken) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      try {
        // Start loading
        setLoading(true);

        // Make the API request
        const response = await axios.get(
          `http://localhost:8000/stores/category/${categoryId}/`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        // Update books state with the fetched data
        setBooks(response.data);  
      } catch (error: any) {
        // Handle errors
        setError(error.response ? error.response.data.detail : error.message);
      } finally {
        // Set loading to false once the request is complete
        setLoading(false);
      }
    };

    // Trigger the fetch function when the component mounts or categoryId changes
    fetchBooksByCategory();
  }, [categoryId, authToken]);  // Include categoryId and authToken as dependencies

  if (loading) return <div>Loading books...</div>; // Display loading message
  if (error) return <div>Error: {error}</div>; // Display error message

  return (
    <div className="px-4 md:px-8 py-8">
        <h2 className="text-3xl font-semibold text-[#5A1A32] text-center py-4">
            Books in Category {categoryId}
        </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {books.length > 0 ? (
          books.map((book) => <BookCard key={book.id} book={book} />)
        ) : (
          <p>No books available in this category.</p>
        )}
      </div>
    </div>
  );
}
