/**
 * User Entity
 * Represents an authenticated user in the system
 */
export interface User {
  username: string;
  email?: string;
  sub?: string; // Cognito user ID
}

/**
 * Login Request
 * Data required for user authentication
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login Response
 * Response from authentication endpoint
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
}

/**
 * Auth Token
 * Represents the stored authentication token
 */
export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_at?: number;
}
