import { createContext, useContext, ReactNode, useState } from 'react';
import { UserRole } from '../api/types.ts';
import { api } from '../api/ServerApi.ts';

interface UserContextType {
  login: string | null;
  userId: string | null;
  role: UserRole | null;
  setUserData: (login: string | null, userId: string | null, role: UserRole | null) => void;
  clearUserData: () => void;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [login, setLogin] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const setUserData = (newLogin: string | null, newUserId: string | null, newRole: UserRole | null) => {
    setLogin(newLogin);
    setUserId(newUserId);
    setRole(newRole);
  };

  const clearUserData = () => {
    setLogin(null);
    setUserId(null);
    setRole(null);
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      clearUserData();
    }
  };

  const isAdmin = role === UserRole.ADMIN;

  return (
    <UserContext.Provider value={{ 
      login, 
      userId, 
      role, 
      setUserData, 
      clearUserData,
      isAdmin,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 