export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: number;
  rating: number;
  description: string;
  genre: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Author {
  id: string;
  name: string;
  photo: string;
  rating: number;
  booksCount: number;
}