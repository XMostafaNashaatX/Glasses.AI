import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface CartItem {
  id: number;
  book: string;
  book_id: number;
  quantity: number;
  price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  fetchCart: () => void;
  addToCart: (bookId: number, quantity?: number) => void;
  updateQuantity: (itemId: number, action: "+" | "-") => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  calculateTotal: () => Promise<number | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/carts/cart/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`, // JWT token
        },
      });
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  // Add item to cart
  const addToCart = async (bookId: number, quantity: number = 1) => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/carts/add/',
        { book_id: bookId, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`, // JWT token
          },
        }
      );
      fetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  // Update item quantity in cart
  const updateQuantity = async (itemId: number, action: "+" | "-") => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/carts/update/${itemId}/`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`, // JWT token
          },
        }
      );
      fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/carts/remove/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`, // JWT token
        },
      });
      fetchCart();
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  // Clear all items in the cart
  const clearCart = async () => {
    try {
      await axios.delete('http://127.0.0.1:8000/carts/clear/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`, // JWT token
        },
      });
      fetchCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  // Calculate the total price of the cart
  const calculateTotal = async (): Promise<number | null> => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/carts/total/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`, // JWT token
        },
      });
      return response.data.total;
    } catch (error) {
      console.error('Failed to calculate total:', error);
      return null;
    }
  };

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
