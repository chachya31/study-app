/**
 * Actor Entity
 * Represents an actor in the system
 */
export interface Actor {
  actor_id: string;
  first_name: string;
  last_name: string;
  last_update: string; // ISO 8601 datetime string
  delete_flag: boolean;
}

/**
 * Actor Create Request
 * Data required to create a new actor
 */
export interface ActorCreateRequest {
  first_name: string;
  last_name: string;
}

/**
 * Actor Update Request
 * Data required to update an existing actor
 */
export interface ActorUpdateRequest {
  first_name?: string;
  last_name?: string;
}

/**
 * Actor Response
 * Response from actor-related API endpoints
 */
export type ActorResponse = Actor;

/**
 * Actors List Response
 * Response from get all actors endpoint
 */
export interface ActorsListResponse {
  actors: Actor[];
}
