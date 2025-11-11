import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type { LoginRequest, User } from "../types";

/**
 * Auth Context Type
 * Defines the shape of the authentication context
 */
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<any>;
  logout: () => void;
  clearError: () => void;
}

/**
 * Auth Context
 * Provides authentication state and methods throughout the application
 * 
 * Requirements: 6.1
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * Wraps the application to provide authentication context
 * 
 * @param children - Child components
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuthContext Hook
 * Custom hook to access authentication context
 * 
 * @throws Error if used outside of AuthProvider
 * @returns Authentication context
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  
  return context;
};
