import React, { createContext, useContext, useReducer } from 'react';
import type { Book } from '../types';

interface FavoritesState {
  items: Book[];
}

type FavoritesAction =
  | { type: 'ADD_TO_FAVORITES'; payload: Book }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string };

const FavoritesContext = createContext<{
  state: FavoritesState;
  dispatch: React.Dispatch<FavoritesAction>;
} | null>(null);

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_TO_FAVORITES':
      if (state.items.some(item => item.id === action.payload.id)) {
        return state;
      }
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    default:
      return state;
  }
};

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, { items: [] });

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