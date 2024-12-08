import React from 'react';
import type { Author } from '../../types';

const TOP_AUTHORS: Author[] = [
  {
    id: '1',
    name: 'J.K. Rowling',
    photo: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    booksCount: 15
  },
  {
    id: '1',
    name: 'J.K. Rowling',
    photo: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    booksCount: 15
  },
  {
    id: '1',
    name: 'J.K. Rowling',
    photo: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    booksCount: 15
  },
  {
    id: '1',
    name: 'J.K. Rowling',
    photo: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    booksCount: 15
  },
  // Add more authors...
];

export function TopAuthors() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Top 10 Rated Authors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {TOP_AUTHORS.map((author) => (
          <div key={author.id} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={author.photo}
              alt={author.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold text-center">{author.name}</h3>
            <div className="text-center text-gray-600">
              <p>Rating: {author.rating}/5</p>
              <p>{author.booksCount} books published</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}