import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFilm, useCreateFilm, useUpdateFilm } from "../hooks";
import { useToast } from "../contexts";
import { LoadingSpinner, Header } from "../components";
import { useFilmFormStore } from "../stores";
import { RATING_VALUES } from "../types";
import type { FilmCreateRequest, FilmUpdateRequest } from "../types";

/**
 * FilmFormPage Component
 * Form for creating and editing films
 */

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

  // Form store
  const {
    title,
    description,
    image_path,
    release_year,
    rating,
    errors,
    setTitle,
    setDescription,
    setImagePath,
    setReleaseYear,
    setRating,
    validate,
    reset,
  } = useFilmFormStore();

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditMode && filmId) {
        // Update existing film
        const updateData: FilmUpdateRequest = {
          title,
          description: description || undefined,
          image_path: image_path || undefined,
          release_year: release_year || undefined,
          rating,
        };
        
        await updateFilmMutation.mutateAsync({
          filmId,
          filmData: updateData,
        });
        showSuccess("Film updated successfully");
      } else {
        // Create new film
        const createData: FilmCreateRequest = {
          title,
          description: description || undefined,
          image_path: image_path || undefined,
          release_year: release_year || undefined,
          rating,
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

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.title}</span>
                )}
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating <span className="text-red-500">*</span>
                </label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value as any)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.rating ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {RATING_VALUES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.rating && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.rating}</span>
                )}
              </div>

              <div>
                <label htmlFor="release_year" className="block text-sm font-medium text-gray-700 mb-1">
                  Release Year
                </label>
                <input
                  id="release_year"
                  type="number"
                  value={release_year || ''}
                  onChange={(e) => setReleaseYear(e.target.value ? Number(e.target.value) : undefined)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.release_year ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.release_year && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.release_year}</span>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="image_path" className="block text-sm font-medium text-gray-700 mb-1">
                  Image Path
                </label>
                <input
                  id="image_path"
                  type="text"
                  value={image_path}
                  onChange={(e) => setImagePath(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition disabled:opacity-50 cursor-pointer"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50 cursor-pointer"
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
