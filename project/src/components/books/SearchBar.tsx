import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
}

export function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search books..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1A32]"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <select
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1A32]"
      >
        <option value="">All Categories</option>
        <option value="title">Book Title</option>
        <option value="author">Author Name</option>
        <option value="genre">Genre</option>
      </select>
    </div>
  );
}