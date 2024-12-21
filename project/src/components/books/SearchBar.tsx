import React, { useState } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';

interface SearchBarProps {
  onBooksFetched: (books: any[]) => void;
  onFilterChange: (filter: string) => void;
}

export function SearchBar({ onBooksFetched, onFilterChange }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const authToken = localStorage.getItem('access');

  const fetchSearchedBooks = async (query: string) => {
    if (!authToken) {
      console.error('Authentication token not available');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/stores/search/',
        { title: query },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      onBooksFetched(response.data);
    } catch (error: any) {
      console.error('Error fetching books:', error.response?.data || error.message);
    }
  };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.trim()) {
      fetchSearchedBooks(newQuery);
    } else {
      onBooksFetched([]); 
    }
  };  


  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search books..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A1A32]"
          value={query}
          onChange={handleSearchChange}
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