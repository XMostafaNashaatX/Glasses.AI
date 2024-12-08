import React from 'react';
import { TopBooks } from '../components/home/TopBooks';
import { TopAuthors } from '../components/home/TopAuthors';

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <TopBooks />
      <TopAuthors />
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
        <TopBooks /> {/* Reusing TopBooks component for demonstration */}
      </section>
    </div>
  );
}