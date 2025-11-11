import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { ErrorResponse } from "../types";

/**
 * API Client
 * Configured Axios instance with interceptors for authentication and error handling
 */

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

/**
 * Request Interceptor
 * Adds authentication token to all requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem("access_token");
    
    if (token) {
      // Add Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors globally and provides consistent error structure
 * 
 * Note: Toast notifications are handled at the component level using useToast hook
 * to avoid circular dependencies with the context
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful response as-is
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const errorResponse: ErrorResponse = error.response.data || {
        error_code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred",
      };

      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        // Clear stored token
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
        
        // Redirect to login page if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      // Return structured error
      return Promise.reject({
        status: error.response.status,
        ...errorResponse,
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        error_code: "NETWORK_ERROR",
        message: "Unable to connect to the server. Please check your network connection.",
      });
    } else {
      // Something else happened
      return Promise.reject({
        error_code: "REQUEST_ERROR",
        message: error.message || "An error occurred while making the request",
      });
    }
  }
);

export default apiClient;
