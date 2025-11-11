import type { Rating } from "./rating";

/**
 * Film Entity
 * Represents a film in the system
 */
export interface Film {
  film_id: string;
  title: string;
  description?: string;
  image_path?: string;
  release_year?: number;
  rating: Rating;
  last_update: string; // ISO 8601 datetime string
  delete_flag: boolean;
}

/**
 * Film Create Request
 * Data required to create a new film
 */
export interface FilmCreateRequest {
  title: string;
  description?: string;
  image_path?: string;
  release_year?: number;
  rating: Rating;
}

/**
 * Film Update Request
 * Data required to update an existing film
 */
export interface FilmUpdateRequest {
  title?: string;
  description?: string;
  image_path?: string;
  release_year?: number;
  rating?: Rating;
}

/**
 * Film Response
 * Response from film-related API endpoints
 */
export type FilmResponse = Film;

/**
 * Films List Response
 * Response from get all films endpoint
 */
export interface FilmsListResponse {
  films: Film[];
}
