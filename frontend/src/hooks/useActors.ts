import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor,
} from "../services/actorService";
import type { Actor, ActorCreateRequest, ActorUpdateRequest } from "../types";

/**
 * Custom hook for managing actors using TanStack Query
 * Provides data fetching and mutations for actor operations
 */

const ACTORS_QUERY_KEY = ["actors"];

/**
 * Hook to fetch all actors
 */
export const useActors = () => {
  return useQuery({
    queryKey: ACTORS_QUERY_KEY,
    queryFn: getActors,
  });
};

/**
 * Hook to fetch a single actor by ID
 */
export const useActor = (actorId: string) => {
  return useQuery({
    queryKey: [...ACTORS_QUERY_KEY, actorId],
    queryFn: () => getActorById(actorId),
    enabled: !!actorId,
  });
};

/**
 * Hook to create a new actor
 */
export const useCreateActor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (actorData: ActorCreateRequest) => createActor(actorData),
    onSuccess: () => {
      // Invalidate and refetch actors list
      queryClient.invalidateQueries({ queryKey: ACTORS_QUERY_KEY });
    },
  });
};

/**
 * Hook to update an existing actor
 */
export const useUpdateActor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ actorId, actorData }: { actorId: string; actorData: ActorUpdateRequest }) =>
      updateActor(actorId, actorData),
    onSuccess: (updatedActor: Actor) => {
      // Invalidate actors list
      queryClient.invalidateQueries({ queryKey: ACTORS_QUERY_KEY });
      // Update specific actor cache
      queryClient.setQueryData([...ACTORS_QUERY_KEY, updatedActor.actor_id], updatedActor);
    },
  });
};

/**
 * Hook to delete an actor (soft delete)
 */
export const useDeleteActor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (actorId: string) => deleteActor(actorId),
    onSuccess: () => {
      // Invalidate and refetch actors list
      queryClient.invalidateQueries({ queryKey: ACTORS_QUERY_KEY });
    },
  });
};
