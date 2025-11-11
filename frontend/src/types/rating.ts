/**
 * Rating Type
 * Represents the movie rating classification
 */
export type Rating = "G" | "PG" | "PG-13" | "R" | "NC-17";

/**
 * Rating values constant for iteration and validation
 */
export const RATING_VALUES: Rating[] = ["G", "PG", "PG-13", "R", "NC-17"];

/**
 * Type guard to check if a string is a valid Rating
 */
export function isValidRating(value: string): value is Rating {
  return RATING_VALUES.includes(value as Rating);
}
