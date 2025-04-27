'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

import { AuthContextType, AuthState, UserCredentials } from '@/types/auth.types';

// Anfänglicher Auth-Zustand
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

// Erstellen des Auth-Kontexts
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider für den Authentifizierungskontext
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const router = useRouter();

  // Beim Initialisieren prüfen, ob Benutzer bereits authentifiziert ist
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Prüfe Session-Status
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated) {
            setAuthState({
              isAuthenticated: true,
              user: data.user,
              loading: false,
              error: null,
            });
            return;
          }
        }

        // Wenn nicht authentifiziert, setze Standardwerte
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Fehler bei der Authentifizierungsprüfung',
        });
      }
    };

    checkAuth();
  }, []);

  /**
   * Login-Funktion
   */
  const login = async (credentials: UserCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAuthState({
          isAuthenticated: true,
          user: data.user || credentials.username,
          loading: false,
          error: null,
        });
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          loading: false,
          error: data.message || 'Anmeldung fehlgeschlagen',
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        loading: false,
        error: 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.',
      }));
      return false;
    }
  };

  /**
   * Logout-Funktion
   */
  const logout = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });

      // Zum Login weiterleiten
      router.push('/login');
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Abmeldung fehlgeschlagen',
      }));
    }
  };

  /**
   * Fehler zurücksetzen
   */
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook zum Verwenden des Auth-Kontexts
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
  }
  return context;
};
