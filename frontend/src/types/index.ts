/**
 * Central export file for all type definitions
 */

// Rating types
export type { Rating } from "./rating";
export { RATING_VALUES, isValidRating } from "./rating";

// Film types
export type {
  Film,
  FilmCreateRequest,
  FilmUpdateRequest,
  FilmResponse,
  FilmsListResponse,
} from "./film";

// Actor types
export type {
  Actor,
  ActorCreateRequest,
  ActorUpdateRequest,
  ActorResponse,
  ActorsListResponse,
} from "./actor";

// User and Auth types
export type {
  User,
  LoginRequest,
  LoginResponse,
  AuthToken,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ConfirmForgotPasswordRequest,
  ConfirmForgotPasswordResponse,
  ConfirmSignUpRequest,
  ConfirmSignUpResponse,
  ResendConfirmationCodeRequest,
  ResendConfirmationCodeResponse,
} from "./user";

// API types
export type {
  ErrorResponse,
  SuccessResponse,
  ApiRequestConfig,
  PaginationParams,
  PaginatedResponse,
} from "./api";
