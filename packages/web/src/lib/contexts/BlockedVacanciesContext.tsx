import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api/ServerApi.ts';
import { useUser } from './UserContext.tsx';
import { UserRole } from '@/lib/api/types.ts';

interface BlockedVacanciesContextType {
  blockedVacancies: string[];
  isBlocked: (id: string) => boolean;
  refreshBlockedVacancies: () => Promise<void>;
}

const BlockedVacanciesContext = createContext<BlockedVacanciesContextType>({
  blockedVacancies: [],
  isBlocked: () => false,
  refreshBlockedVacancies: async () => {},
});

export const useBlockedVacancies = () => useContext(BlockedVacanciesContext);

export const BlockedVacanciesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blockedVacancies, setBlockedVacancies] = useState<string[]>([]);
  const { role } = useUser();

  const refreshBlockedVacancies = async () => {
    if (role && role === UserRole.ADMIN) {
      try {
        const response = await api.getBlockedVacancies();
        setBlockedVacancies(response.blockedVacancies);
      } catch (error) {
        console.error('Failed to fetch blocked vacancies:', error);
      }
    }
  };

  useEffect(() => {
    refreshBlockedVacancies();
  }, [role]);

  const isBlocked = (id: string) => blockedVacancies.includes(id);

  return (
    <BlockedVacanciesContext.Provider value={{ blockedVacancies, isBlocked, refreshBlockedVacancies }}>
      {children}
    </BlockedVacanciesContext.Provider>
  );
}; 