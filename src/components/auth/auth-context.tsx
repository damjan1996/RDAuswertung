'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for demo purposes
  const [user, setUser] = useState<string | null>('Admin'); // Default user for demo

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication logic
    if (username && password) {
      setIsAuthenticated(true);
      setUser(username);
      return true;
    }
    return false;
  };

  const logout = async (): Promise<void> => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
