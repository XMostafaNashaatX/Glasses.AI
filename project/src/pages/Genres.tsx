import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BookText, Coffee, Heart, Telescope } from 'lucide-react';
import axios from 'axios';

const genres = [
  { id: 1, name: 'Action', icon: Coffee, description: 'Thrilling detective stories', count: 986 },
  { id: 2, name: 'Romantic', icon: Heart, description: 'Love stories that warm your heart', count: 1823 },
  { id: 3, name: 'Drama', icon: BookText, description: 'Compelling imaginary worlds', count: 2547 },
  { id: 4, name: 'Fiction', icon: Telescope, description: 'Technological adventures', count: 1245 },
  { id: 5, name: 'History', icon: BookOpen, description: 'Timeless literary masterpieces', count: 743 },
];

export default function Genres() {
  const [books, setBooks] = useState<any[]>([]);  // Adjust type as needed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const authToken = localStorage.getItem('access');  // Get the auth token from localStorage

  const fetchBooksByCategory = async (categoryId: number) => {
    if (!authToken) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Correct URL using categoryId and include the Authorization header with the token
      const response = await axios.get(
        `http://localhost:8000/stores/category/${categoryId}/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,  // Add auth token to request
          },
        }
      );
      setBooks(response.data);
      navigate(`/category/${categoryId}`); // Navigate to the category page with category ID
    } catch (error: any) {
      console.error("Error fetching books:", error);
      setError(error.response ? error.response.data.detail : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-8 py-6" >
      <h1 className="text-4xl font-bold text-[#5A1A32] text-center py-4">Browse Genres</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {genres.map((genre) => {
          const Icon = genre.icon;
          return (
            <div
              key={genre.id}
              onClick={() => fetchBooksByCategory(genre.id)} // Pass the correct category ID
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

      {/* Display error or loading message */}
      {error && <div className="text-red-600 mt-4">{error}</div>}

      {/* Display books if available */}
      {loading ? (
        <div>Loading books...</div>
      ) : (
        <div>
          {books.length > 0 && (
            <div>
              <h2 className="text-3xl font-semibold text-[#5A1A32] mt-8">Books in this Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {books.map((book) => (
                  <div key={book.id} className="bg-white p-4 shadow-md rounded-lg">
                    <h3 className="text-xl font-semibold text-[#5A1A32]">{book.title}</h3>
                    <p className="text-sm text-[#A8A8AA]">{book.author}</p>
                    <p className="text-gray-600 mt-2">{book.year_publication}</p>
                    <p className="text-gray-600 mt-2">Price: ${book.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
