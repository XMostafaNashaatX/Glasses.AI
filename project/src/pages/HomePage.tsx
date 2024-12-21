// src/pages/HomePage.tsx
import React from 'react';
import { TopBooks } from '../components/home/TopBooks';
import { TopAuthors } from '../components/home/TopAuthors';
import { RecommendedBooks } from '../components/home/RecommendedBooks'; // Import RecommendedBooks component

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <TopBooks />
      <TopAuthors />
      <section className="py-8">
        <RecommendedBooks /> {/* Use RecommendedBooks component for displaying recommendations */}
      </section>
    </div>
  );
}
