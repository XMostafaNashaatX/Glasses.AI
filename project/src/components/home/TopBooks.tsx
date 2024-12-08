import React from 'react';
import { BookCard } from '../books/BookCard';

const TOP_BOOKS = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    price: 19.99,
    rating: 4.8,
    description: 'A classic novel about the American Dream.',
    genre: ['Fiction', 'Classic'],
    reviews: [],
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    price: 14.99,
    rating: 4.7,
    description: 'A dystopian novel depicting a totalitarian society.',
    genre: ['Fiction', 'Dystopian'],
    reviews: [],
  },
];


export function TopBooks() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Top 10 Rated Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {TOP_BOOKS.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}