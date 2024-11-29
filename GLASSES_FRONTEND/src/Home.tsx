import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'The Gunslinger',
      author: 'Stephen King',
      image: 'https://covers.openlibrary.org/b/id/10517658-L.jpg',
      rating: 4,
    },
    {
      id: 2,
      title: 'The Drawing of the Three',
      author: 'Stephen King',
      image: 'https://covers.openlibrary.org/b/id/10517656-L.jpg',
      rating: 5,
    },
    {
      id: 3,
      title: 'The Waste Lands',
      author: 'Stephen King',
      image: 'https://covers.openlibrary.org/b/id/10517657-L.jpg',
      rating: 4,
    },
    {
      id: 4,
      title: 'Dune',
      author: 'Frank Herbert',
      image: 'https://covers.openlibrary.org/b/id/8696742-L.jpg',
      rating: 5,
    },
    {
      id: 5,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      image: 'https://covers.openlibrary.org/b/id/10440416-L.jpg',
      rating: 4,
    },
    {
      id: 6,
      title: '1984',
      author: 'George Orwell',
      image: 'https://covers.openlibrary.org/b/id/8228699-L.jpg',
      rating: 5,
    },
  ]);

  const [hoveredStars, setHoveredStars] = useState<Record<number, number | undefined>>({});
  const [theme, setTheme] = useState('dark');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMouseEnter = (bookId: number, star: number) => {
    setHoveredStars((prev) => ({ ...prev, [bookId]: star }));
  };

  const handleMouseLeave = (bookId: number) => {
    setHoveredStars((prev) => ({ ...prev, [bookId]: undefined }));
  };

  const handleRating = (bookId: number, newRating: number) => {
    setBooks(books.map((book) => (book.id === bookId ? { ...book, rating: newRating } : book)));
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`home-container ${theme}`}>
      <nav className="navbar">
        <div className="navbar-logo">Glasses<span>.AI</span></div>
        <ul className="navbar-links">
          <li>Home</li>
          <li>Recommended</li>
          <li>Genres</li>
          <li>Contact</li>
        </ul>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </nav>

      <div className="banner">
        <div className="banner-content">
          <h1>AYWA YA NASHOOOOOOOOT</h1>
          <p>
            T3ala adla3k 5od fekra w t3ala bokra 3ndna akwa el 3rod w aderna na7tm el as3ar w 3la
            allah el tasahel
          </p>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <button>Search</button>
      </div>

      <div className="book-list">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-item">
            <img src={book.image} alt={book.title} className="book-image" />
            <div className="book-info">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${
                      (hoveredStars[book.id] || book.rating) >= star ? 'filled' : ''
                    }`}
                    onMouseEnter={() => handleMouseEnter(book.id, star)}
                    onMouseLeave={() => handleMouseLeave(book.id)}
                    onClick={() => handleRating(book.id, star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
