import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api/ServerApi.ts';
import { useUser } from './UserContext.tsx';

interface ViewedContextType {
  viewed: string[];
  isViewed: (vacancyId: string) => boolean;
  addToViewed: (vacancyId: string) => Promise<void>;
  setViewed: React.Dispatch<React.SetStateAction<string[]>>;
}

const ViewedContext = createContext<ViewedContextType | null>(null);

export const ViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewed, setViewed] = useState<string[]>([]);
  const { login } = useUser();

  useEffect(() => {
    if (login) {
      api.getViewed()
        .then(response => setViewed(response.viewed))
        .catch(console.error);
    } else {
      setViewed([]);
    }
  }, [login]);

  const isViewed = (vacancyId: string) => viewed.includes(vacancyId);

  const addToViewed = async (vacancyId: string) => {
    try {
      const response = await api.addToViewed(vacancyId);
      setViewed(response.viewed);
    } catch (error) {
      console.error('Failed to add vacancy to viewed:', error);
    }
  };

  return (
    <ViewedContext.Provider value={{ viewed, isViewed, addToViewed, setViewed }}>
      {children}
    </ViewedContext.Provider>
  );
};

export const useViewed = () => {
  const context = useContext(ViewedContext);
  if (!context) {
    throw new Error('useViewed must be used within a ViewedProvider');
  }
  return context;
}; 