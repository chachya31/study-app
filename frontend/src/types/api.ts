/**
 * API Error Response
 * Standard error response structure from the backend
 */
export interface ErrorResponse {
  error_code: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * API Success Response
 * Generic success response wrapper
 */
export interface SuccessResponse<T = any> {
  data: T;
  message?: string;
}

/**
 * API Request Config
 * Configuration for API requests
 */
export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

/**
 * Pagination Parameters
 * For future pagination support
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Paginated Response
 * For future pagination support
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}
