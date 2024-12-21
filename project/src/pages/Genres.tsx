import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BookText, Coffee, Heart, Sword, Telescope } from 'lucide-react';

const genres = [
  {
    name: 'Fiction',
    icon: BookText,
    description: 'Explore imaginary worlds and compelling stories',
    count: 2547
  },
  {
    name: 'Romance',
    icon: Heart,
    description: 'Love stories that warm your heart',
    count: 1823
  },
  {
    name: 'Science Fiction',
    icon: Telescope,
    description: 'Future worlds and technological adventures',
    count: 1245
  },
  {
    name: 'Mystery',
    icon: Coffee,
    description: 'Thrilling detective stories and puzzling cases',
    count: 986
  },
  {
    name: 'Fantasy',
    icon: Sword,
    description: 'Magic, dragons, and epic adventures',
    count: 1654
  },
  {
    name: 'Classics',
    icon: BookOpen,
    description: 'Timeless literary masterpieces',
    count: 743
  }
];

export default function Genres() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-[#5A1A32]">Browse Genres</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {genres.map((genre) => {
          const Icon = genre.icon;
          return (
            <div
              key={genre.name}
              onClick={() => navigate(`/books/${genre.name}`)}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-[#A8A8AA]/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-[#5A1A32]/10">
                  <Icon className="w-6 h-6 text-[#5A1A32]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#5A1A32]">{genre.name}</h3>
                  <p className="text-sm text-[#A8A8AA]">{genre.count} books</p>
                </div>
              </div>
              <p className="text-gray-600">{genre.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}