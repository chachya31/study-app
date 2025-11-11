import apiClient from "./apiClient";
import type {
  Actor,
  ActorCreateRequest,
  ActorUpdateRequest,
  ActorResponse,
  ActorsListResponse,
} from "../types";

/**
 * Actor Service
 * Handles all actor-related API operations
 */

/**
 * Get all actors
 * Retrieves all actors with delete_flag=false
 * 
 * @returns Promise with array of actors
 */
export const getActors = async (): Promise<Actor[]> => {
  const response = await apiClient.get<ActorsListResponse>("/api/actors");
  return response.data.actors;
};

/**
 * Get actor by ID
 * Retrieves a specific actor by their ID
 * 
 * @param actorId - The ID of the actor to retrieve
 * @returns Promise with actor data
 */
export const getActorById = async (actorId: string): Promise<Actor> => {
  const response = await apiClient.get<ActorResponse>(`/api/actors/${actorId}`);
  return response.data;
};

/**
 * Create new actor
 * Creates a new actor with the provided data
 * 
 * @param actorData - Actor creation data
 * @returns Promise with created actor data
 */
export const createActor = async (actorData: ActorCreateRequest): Promise<Actor> => {
  const response = await apiClient.post<ActorResponse>("/api/actors", actorData);
  return response.data;
};

/**
 * Update actor
 * Updates an existing actor with the provided data
 * 
 * @param actorId - The ID of the actor to update
 * @param actorData - Actor update data
 * @returns Promise with updated actor data
 */
export const updateActor = async (
  actorId: string,
  actorData: ActorUpdateRequest
): Promise<Actor> => {
  const response = await apiClient.put<ActorResponse>(
    `/api/actors/${actorId}`,
    actorData
  );
  return response.data;
};

/**
 * Delete actor
 * Soft deletes an actor by setting delete_flag to true
 * 
 * @param actorId - The ID of the actor to delete
 * @returns Promise that resolves when deletion is complete
 */
export const deleteActor = async (actorId: string): Promise<void> => {
  await apiClient.delete(`/api/actors/${actorId}`);
};
