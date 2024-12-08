import React, { createContext, useContext, useReducer } from 'react';
import type { Book } from '../types';

interface CartItem {
  book: Book;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Book }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { bookId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.book.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.book.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
        };
      }
      return {
        ...state,
        items: [...state.items, { book: action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      };
    }
    case 'REMOVE_FROM_CART': {
      const item = state.items.find(item => item.book.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.book.id !== action.payload),
        total: state.total - (item ? item.book.price * item.quantity : 0),
      };
    }
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.book.id === action.payload.bookId);
      if (!item) return state;
      
      const quantityDiff = action.payload.quantity - item.quantity;
      return {
        ...state,
        items: state.items.map(item =>
          item.book.id === action.payload.bookId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.book.price * quantityDiff),
      };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}