import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFilms,
  getFilmById,
  createFilm,
  updateFilm,
  deleteFilm,
} from "../services/filmService";
import type { Film, FilmCreateRequest, FilmUpdateRequest } from "../types";

/**
 * Custom hook for managing films using TanStack Query
 * Provides data fetching and mutations for film operations
 */

const FILMS_QUERY_KEY = ["films"];

/**
 * Hook to fetch all films
 */
export const useFilms = () => {
  return useQuery({
    queryKey: FILMS_QUERY_KEY,
    queryFn: getFilms,
  });
};

/**
 * Hook to fetch a single film by ID
 */
export const useFilm = (filmId: string) => {
  return useQuery({
    queryKey: [...FILMS_QUERY_KEY, filmId],
    queryFn: () => getFilmById(filmId),
    enabled: !!filmId,
  });
};

/**
 * Hook to create a new film
 */
export const useCreateFilm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filmData: FilmCreateRequest) => createFilm(filmData),
    onSuccess: () => {
      // Invalidate and refetch films list
      queryClient.invalidateQueries({ queryKey: FILMS_QUERY_KEY });
    },
  });
};

/**
 * Hook to update an existing film
 */
export const useUpdateFilm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ filmId, filmData }: { filmId: string; filmData: FilmUpdateRequest }) =>
      updateFilm(filmId, filmData),
    onSuccess: (updatedFilm: Film) => {
      // Invalidate films list
      queryClient.invalidateQueries({ queryKey: FILMS_QUERY_KEY });
      // Update specific film cache
      queryClient.setQueryData([...FILMS_QUERY_KEY, updatedFilm.film_id], updatedFilm);
    },
  });
};

/**
 * Hook to delete a film (soft delete)
 */
export const useDeleteFilm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filmId: string) => deleteFilm(filmId),
    onSuccess: () => {
      // Invalidate and refetch films list
      queryClient.invalidateQueries({ queryKey: FILMS_QUERY_KEY });
    },
  });
};
