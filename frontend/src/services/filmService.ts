import apiClient from "./apiClient";
import type {
  Film,
  FilmCreateRequest,
  FilmUpdateRequest,
  FilmResponse,
  FilmsListResponse,
} from "../types";

/**
 * Film Service
 * Handles all film-related API operations
 */

/**
 * Get all films
 * Retrieves all films with delete_flag=false
 * 
 * @returns Promise with array of films
 */
export const getFilms = async (): Promise<Film[]> => {
  const response = await apiClient.get<FilmsListResponse>("/api/films");
  console.log(response.data)
  return response.data.films;
};

/**
 * Get film by ID
 * Retrieves a specific film by its ID
 * 
 * @param filmId - The ID of the film to retrieve
 * @returns Promise with film data
 */
export const getFilmById = async (filmId: string): Promise<Film> => {
  const response = await apiClient.get<FilmResponse>(`/api/films/${filmId}`);
  return response.data;
};

/**
 * Create new film
 * Creates a new film with the provided data
 * 
 * @param filmData - Film creation data
 * @returns Promise with created film data
 */
export const createFilm = async (filmData: FilmCreateRequest): Promise<Film> => {
  const response = await apiClient.post<FilmResponse>("/api/films", filmData);
  return response.data;
};

/**
 * Update film
 * Updates an existing film with the provided data
 * 
 * @param filmId - The ID of the film to update
 * @param filmData - Film update data
 * @returns Promise with updated film data
 */
export const updateFilm = async (
  filmId: string,
  filmData: FilmUpdateRequest
): Promise<Film> => {
  const response = await apiClient.put<FilmResponse>(
    `/api/films/${filmId}`,
    filmData
  );
  return response.data;
};

/**
 * Delete film
 * Soft deletes a film by setting delete_flag to true
 * 
 * @param filmId - The ID of the film to delete
 * @returns Promise that resolves when deletion is complete
 */
export const deleteFilm = async (filmId: string): Promise<void> => {
  await apiClient.delete(`/api/films/${filmId}`);
};
