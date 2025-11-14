/**
 * User Entity
 * Represents an authenticated user in the system
 */
export interface User {
  username: string;
  name?: string;
  email?: string;
  sub?: string; // Cognito user ID
  email_verified?: boolean;
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

/**
 * Forgot Password Request
 * Data required for password reset request
 */
export interface ForgotPasswordRequest {
  username: string;
}

/**
 * Forgot Password Response
 * Response from forgot password endpoint
 */
export interface ForgotPasswordResponse {
  message: string;
  destination: string;
  delivery_medium: string;
}

/**
 * Confirm Forgot Password Request
 * Data required for confirming password reset
 */
export interface ConfirmForgotPasswordRequest {
  username: string;
  confirmation_code: string;
  new_password: string;
}

/**
 * Confirm Forgot Password Response
 * Response from confirm forgot password endpoint
 */
export interface ConfirmForgotPasswordResponse {
  message: string;
}

/**
 * Confirm Sign Up Request
 * Data required for confirming user registration
 */
export interface ConfirmSignUpRequest {
  username: string;
  confirmation_code: string;
}

/**
 * Confirm Sign Up Response
 * Response from confirm sign up endpoint
 */
export interface ConfirmSignUpResponse {
  message: string;
}

/**
 * Resend Confirmation Code Request
 * Data required for resending confirmation code
 */
export interface ResendConfirmationCodeRequest {
  username: string;
}

/**
 * Resend Confirmation Code Response
 * Response from resend confirmation code endpoint
 */
export interface ResendConfirmationCodeResponse {
  message: string;
  destination: string;
  delivery_medium: string;
}
