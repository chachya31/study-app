import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFilm, useCreateFilm, useUpdateFilm } from "../hooks";
import { useToast } from "../contexts";
import { LoadingSpinner, Header } from "../components";
import { RATING_VALUES } from "../types";
import type { Rating, FilmCreateRequest, FilmUpdateRequest } from "../types";

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {isEditMode ? "Edit Film" : "Create New Film"}
            </h1>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                Error: {error instanceof Error ? error.message : "Failed to save film"}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.title.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating <span className="text-red-500">*</span>
                </label>
                <select
                  id="rating"
                  {...register("rating", {
                    required: "Rating is required",
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.rating ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {RATING_VALUES.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
                {errors.rating && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.rating.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="release_year" className="block text-sm font-medium text-gray-700 mb-1">
                  Release Year
                </label>
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.release_year ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.release_year && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.release_year.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.description.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="image_path" className="block text-sm font-medium text-gray-700 mb-1">
                  Image Path
                </label>
                <input
                  id="image_path"
                  type="text"
                  {...register("image_path")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.image_path ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image_path && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.image_path.message}</span>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition disabled:opacity-50"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : isEditMode ? "Update Film" : "Create Film"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilmFormPage;
