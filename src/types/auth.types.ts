/**
 * Authentifizierungstypen für die Anwendung
 */

export interface UserCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: UserCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}
