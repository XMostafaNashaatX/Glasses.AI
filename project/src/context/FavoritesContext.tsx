import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Book } from '../types';
import axios from 'axios';

// Define the state and actions
interface FavoritesState {
  items: Book[];
}

type FavoritesAction =
  | { type: 'ADD_TO_FAVORITES'; payload: Book }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'SET_FAVORITES'; payload: Book[] };

const FavoritesContext = createContext<{
  state: FavoritesState;
  dispatch: React.Dispatch<FavoritesAction>;
} | null>(null);

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_TO_FAVORITES':
      if (state.items.some((item) => item.id === action.payload.id)) {
        return state;
      }
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'SET_FAVORITES':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, { items: [] });

  //const authToken = localStorage.getItem('access');

  // Fetch favorite books from the backend API
  useEffect(() => {
    const fetchFavorites = async () => {
      const authToken = localStorage.getItem('access');
      if (authToken) {
        try {
          const response = await fetch('http://127.0.0.1:8000/favourite_list/get_all/', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const data = await response.json();
          // Assuming the data is an array of book objects, update the context
          dispatch({ type: 'SET_FAVORITES', payload: data });
        } catch (error) {
          console.error('Error fetching favorite list:', error);
        }
      }
    };

    fetchFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{ state, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
