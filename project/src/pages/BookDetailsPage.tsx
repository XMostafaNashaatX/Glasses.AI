import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookDetails } from '../components/books/BookDetails';
import type { Book } from '../types';

export function BookDetailsPage() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the book details from the API based on the book ID
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/stores/books/${id}/`);
        if (!response.ok) {
          throw new Error('Book not found');
        }
        const data: Book = await response.json();
        setBook(data); // Set the fetched book data to the state
      } catch (err) {
        setError('Failed to load book details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return <BookDetails book={book} />;
}
