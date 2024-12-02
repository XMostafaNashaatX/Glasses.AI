import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Home.css";


const books = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", image: "http://bookcoverarchive.com/wp-content/uploads/2016/03/A1Pim60eMZL.jpg", rating: 4 },
    { title: "To Kill a Mockingbird", author: "Harper Lee", image: "http://bookcoverarchive.com/wp-content/uploads/2016/03/A1Pim60eMZL.jpg", rating: 5 },
    { title: "1984", author: "George Orwell", image: "http://bookcoverarchive.com/wp-content/uploads/2016/03/A1Pim60eMZL.jpg", rating: 3 },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", image: "http://bookcoverarchive.com/wp-content/uploads/2016/03/A1Pim60eMZL.jpg", rating: 4 },
    { title: "Pride and Prejudice", author: "Jane Austen", image: "http://bookcoverarchive.com/wp-content/uploads/2016/03/A1Pim60eMZL.jpg", rating: 5 },
    { title: "Moby Dick", author: "Herman Melville", image: "http://bookcoverarchive.com/wp-content/uploads/2016/03/A1Pim60eMZL.jpg", rating: 3 },
    { title: "War and Peace", author: "Leo Tolstoy", image: "http://bookcoverarchive.com/wp-content/uploads/2016/03/A1Pim60eMZL.jpg", rating: 4 },
    { title: "The Hobbit", author: "J.R.R. Tolkien", image: "http://bookcoverarchive.com/wp-content/uploads/2016/03/A1Pim60eMZL.jpg", rating: 4 },
];

const authors = [...new Set(books.map(book => book.author))];

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [sortOrder, setSortOrder] = useState("alphabetical");
    const [books, setBooks] = useState<any[]>([]); 
    const [bookId, setBookId] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cart, setCart] = useState<string[]>([]);

    useEffect(() => {
        const fetchCsrfToken = async () => {
          try {
            const response = await fetch("http://127.0.0.1:8000/users/csrf/", {
              credentials: "include",
            });
            const data = await response.json();
            setCsrfToken(data.csrf_token);
          } catch (error) {
            console.error("Failed to fetch CSRF token:", error);
          }
        };
        fetchCsrfToken();
    }, []);
    
    const fetchAllBooks = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/stores/books/all/", {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          setBooks(response.data);
          console.log("All Books:", response.data);
        } catch (error: any) {
          console.error("Error fetching all books:", error.response?.data || error.message);
        }
      };

      const fetchBooks = async (query: string) => {
        if (!csrfToken) {
            console.error("CSRF Token not available");
            return;
        }
    
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/stores/search/",
                { title: query }, 
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken,
                    },
                    withCredentials: true,
                }
            );
            setBooks(response.data);
            console.log("Books fetched successfully:", response.data);
        } catch (error: any) {
            console.error("Error fetching books:", error.response?.data || error.message);
        }
    };

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchInput(query);
        if (query.trim()) {
          fetchBooks(query);
        } else {
            fetchAllBooks(); 
        }
    };

    const sortedBooks = books.sort((a: any, b: any) => {
        if (sortOrder === "alphabetical") {
            return a.title.localeCompare(b.title);
        } else if (sortOrder === "rating") {
            return b.rating - a.rating;
        }
        return 0;
    });

    const handleRatingChange = (bookTitle: string, newRating: number) => {
        setRatings((prevRatings) => ({ ...prevRatings, [bookTitle]: newRating }));
    };

    const handleAddToCart = (bookId: string) => {
        setCart((prevCart) => [...prevCart, bookId]);
    };
    
    const swipeNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
    };

    const swipePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? books.length - 1 : prevIndex - 1));
    };

    useEffect(() => {
        fetchAllBooks();
    }, []);
    

    const handleGoToCart = () => {
        navigate("/cart");
    };

    return (
        <div className="homepage">
            <header className="home-header">
                <nav className="navbar">
                    <div className="logo">Glasses.AI</div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                        <button onClick={() => fetchBooks(searchInput)}>Search</button>
                    </div>
                    <div className="nav-links">
                        <a href="#">Home</a>
                        <a href="#">Genres</a>
                        <a href="#">New Releases</a>
                        <a href="#">My List</a>
                    </div>
                    <div className="sort-options">
                        <label htmlFor="sort-order" style={{ color: "white" }}>Sort By:</label>
                        <select
                            id="sort-order"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="alphabetical">Alphabetical</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                    <div className="cart-icon">
                        <button onClick={handleGoToCart}>
                            🛒
                            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
                        </button>
                    </div>
                </nav>
                <h1>Welcome to Glasses.AI</h1>
                <p>Your perfect pair of glasses is just a click away.</p>
            </header>

            <button className="go-to-cart-btn" onClick={handleGoToCart}>
                Go to Cart
            </button>

            <div className="hero">
                <div className="hero-content">
                    <img src="https://via.placeholder.com/600x300" alt="Featured Book Cover" />
                    <div className="hero-details">
                        <h1>"The Art of Reading"</h1>
                        <p>Explore the world of books through this immersive masterpiece.</p>
                        <button className="trailer-btn">Read More</button>
                    </div>
                </div>
            </div>

            <div className="featured">
    <h2>Featured Today</h2>
    {books.length === 0 ? (
        <p>No books found. Try a different search query.</p>
    ) : (
        <div className="featured-books-container">
            <div
                className="featured-books"
                style={{
                    transform: `translateX(-${Math.min(currentIndex, books.length - 1) * 170}px)`,
                    transition: currentIndex < books.length - 1 ? undefined : "none",
                }}
            >
                {sortedBooks.map((book, index) => (
                    <div className="book-card" key={index}>
                        <img src={book.image_url_l || "https://via.placeholder.com/150"} alt={book.title} />
                        <p>{book.title}</p>
                        <p><em>by {book.author}</em></p>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${ratings[book.title] >= star ? "filled" : ""}`}
                                    onClick={() => handleRatingChange(book.title, star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <button className="add-to-cart-btn" onClick={() => handleAddToCart(book.id)}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
            <button className="swipe-button prev" onClick={swipePrev}>‹</button>
            <button className="swipe-button next" onClick={swipeNext}>›</button>
        </div>
    )}
</div>

            <div className="author-section">
                <h2>Authors Featured Today</h2>
                <div className="author-list" style={{ display: "flex", overflowX: "auto", gap: "15px", scrollBehavior: "smooth" }}>
                    {books.map((book, index) => (
                        <div className="author-card" key={index}>
                        <img
                            src={`https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/J.K._Rowling_2010.jpg/800px-J.K._Rowling_2010.jpg`} // Example for author J.K. Rowling
                            alt={book.author}
                        />
                        <p>{book.author}</p>
                    </div>
                    ))}
                </div>
            </div>

          <div className="recommendations">
                <h2>Recommended for You</h2>
                <div className="recommendation-list">
                    {books.slice(0, 3).map((book, index) => (
                        <div className="recommendation-card" key={index}>
                        <img src={book.image_url_l || "https://via.placeholder.com/150"} alt={book.title} />
                        <p>{book.title}</p>
                    </div>
                    ))}
                </div>
            </div>
        </div>  
            
    );
};

export default Home;
