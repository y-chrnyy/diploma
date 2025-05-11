import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api/ServerApi.ts';
import { useQuery } from '@tanstack/react-query';

interface FavoritesContextType {
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const { data } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      try {
        const response = await api.getFavorites();
        return response.favorites;
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
        return [];
      }
    }
  });

  useEffect(() => {
    if (data) {
      setFavorites(data);
    }
  }, [data]);

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}; 