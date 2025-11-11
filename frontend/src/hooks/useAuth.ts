import { useState, useEffect, useCallback } from "react";
import * as authService from "../services/authService";
import type { LoginRequest, User } from "../types";

/**
 * Authentication state interface
 */
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

/**
 * useAuth Hook
 * Custom hook for managing authentication state
 * 
 * Provides:
 * - Login functionality
 * - Logout functionality
 * - Authentication state management
 * - Token storage in localStorage
 * 
 * Requirements: 6.1, 6.2
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  /**
   * Initialize authentication state on mount
   * Checks if user has valid token in localStorage
   */
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      
      if (isAuth) {
        // If authenticated, we could decode the token to get user info
        // For now, we'll set a basic user object
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: { username: "user" }, // This could be decoded from JWT
          error: null,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  /**
   * Login function
   * Authenticates user and stores token in localStorage
   * 
   * @param credentials - User login credentials
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.login(credentials);
      
      // Set authenticated state
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: { username: credentials.username },
        error: null,
      });

      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "ログインに失敗しました";
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: errorMessage,
      });

      throw error;
    }
  }, []);

  /**
   * Logout function
   * Clears authentication tokens from localStorage
   */
  const logout = useCallback(() => {
    authService.logout();
    
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
    });
  }, []);

  /**
   * Clear error
   * Clears any authentication error
   */
  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    error: authState.error,
    login,
    logout,
    clearError,
  };
};
