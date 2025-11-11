import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFilm, useCreateFilm, useUpdateFilm } from "../hooks";
import { useToast } from "../contexts";
import { LoadingSpinner, Header } from "../components";
import { RATING_VALUES } from "../types";
import type { Rating, FilmCreateRequest, FilmUpdateRequest } from "../types";
import "./FilmFormPage.css";

/**
 * FilmFormPage Component
 * Form for creating and editing films
 */

interface FilmFormData {
  title: string;
  description?: string;
  image_path?: string;
  release_year?: number;
  rating: Rating;
}

const FilmFormPage = () => {
  const navigate = useNavigate();
  const { id: filmId } = useParams<{ id: string }>();
  const isEditMode = !!filmId;
  const { showError, showSuccess } = useToast();

  // Fetch film data if in edit mode
  const { data: film, isLoading: isLoadingFilm, error: loadError } = useFilm(filmId || "");
  
  // Mutations
  const createFilmMutation = useCreateFilm();
  const updateFilmMutation = useUpdateFilm();

  // Show error toast when there's a loading error
  useEffect(() => {
    if (loadError) {
      const errorMessage = loadError instanceof Error ? loadError.message : "Failed to load film";
      showError(errorMessage);
    }
  }, [loadError, showError]);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FilmFormData>({
    defaultValues: {
      title: "",
      description: "",
      image_path: "",
      release_year: undefined,
      rating: "G",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (film && isEditMode) {
      reset({
        title: film.title,
        description: film.description || "",
        image_path: film.image_path || "",
        release_year: film.release_year || undefined,
        rating: film.rating,
      });
    }
  }, [film, isEditMode, reset]);

  const onSubmit = async (data: FilmFormData) => {
    try {
      if (isEditMode && filmId) {
        // Update existing film
        const updateData: FilmUpdateRequest = {
          title: data.title,
          description: data.description || undefined,
          image_path: data.image_path || undefined,
          release_year: data.release_year || undefined,
          rating: data.rating,
        };
        
        await updateFilmMutation.mutateAsync({
          filmId,
          filmData: updateData,
        });
        showSuccess("Film updated successfully");
      } else {
        // Create new film
        const createData: FilmCreateRequest = {
          title: data.title,
          description: data.description || undefined,
          image_path: data.image_path || undefined,
          release_year: data.release_year || undefined,
          rating: data.rating,
        };
        
        await createFilmMutation.mutateAsync(createData);
        showSuccess("Film created successfully");
      }
      
      // Navigate back to films list on success
      navigate("/films");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to save film";
      showError(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/films");
  };

  if (isEditMode && isLoadingFilm) {
    return <LoadingSpinner fullScreen message="Loading film data..." />;
  }

  const isPending = createFilmMutation.isPending || updateFilmMutation.isPending;
  const error = createFilmMutation.error || updateFilmMutation.error;

  return (
    <>
      <Header />
      <div className="film-form-page">
        <div className="form-container">
          <h1>{isEditMode ? "Edit Film" : "Create New Film"}</h1>

        {error && (
          <div className="error-message">
            Error: {error instanceof Error ? error.message : "Failed to save film"}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="film-form">
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 1,
                  message: "Title cannot be empty",
                },
              })}
              className={errors.title ? "error" : ""}
            />
            {errors.title && (
              <span className="error-text">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="rating">
              Rating <span className="required">*</span>
            </label>
            <select
              id="rating"
              {...register("rating", {
                required: "Rating is required",
              })}
              className={errors.rating ? "error" : ""}
            >
              {RATING_VALUES.map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
            {errors.rating && (
              <span className="error-text">{errors.rating.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="release_year">Release Year</label>
            <input
              id="release_year"
              type="number"
              {...register("release_year", {
                valueAsNumber: true,
                min: {
                  value: 1800,
                  message: "Release year must be between 1800 and 2100",
                },
                max: {
                  value: 2100,
                  message: "Release year must be between 1800 and 2100",
                },
              })}
              className={errors.release_year ? "error" : ""}
            />
            {errors.release_year && (
              <span className="error-text">{errors.release_year.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={4}
              {...register("description")}
              className={errors.description ? "error" : ""}
            />
            {errors.description && (
              <span className="error-text">{errors.description.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image_path">Image Path</label>
            <input
              id="image_path"
              type="text"
              {...register("image_path")}
              className={errors.image_path ? "error" : ""}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image_path && (
              <span className="error-text">{errors.image_path.message}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? "Saving..." : isEditMode ? "Update Film" : "Create Film"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default FilmFormPage;
