import apiClient from "./apiClient";
import type { LoginRequest, LoginResponse } from "../types";

/**
 * Authentication Service
 * Handles user authentication operations
 */

/**
 * Login user
 * Authenticates user with username and password
 * 
 * @param credentials - User login credentials
 * @returns Promise with login response containing access token
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/api/auth/login", credentials);
  
  // Store token in localStorage
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("token_type", response.data.token_type || "Bearer");
    
    // Store expiration time if provided
    if (response.data.expires_in) {
      const expiresAt = Date.now() + response.data.expires_in * 1000;
      localStorage.setItem("expires_at", expiresAt.toString());
    }
  }
  
  return response.data;
};

/**
 * Logout user
 * Clears authentication tokens from localStorage
 */
export const logout = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("expires_at");
};

/**
 * Check if user is authenticated
 * Verifies if a valid token exists in localStorage
 * 
 * @returns boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("access_token");
  
  if (!token) {
    return false;
  }
  
  // Check if token is expired
  const expiresAt = localStorage.getItem("expires_at");
  if (expiresAt) {
    const expirationTime = parseInt(expiresAt, 10);
    if (Date.now() >= expirationTime) {
      // Token expired, clear it
      logout();
      return false;
    }
  }
  
  return true;
};

/**
 * Get current access token
 * 
 * @returns Access token or null if not authenticated
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};
