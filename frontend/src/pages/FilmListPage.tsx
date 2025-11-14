import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFilms, useDeleteFilm } from "../hooks";
import { useToast } from "../contexts";
import { ConfirmDialog, LoadingSpinner, Header } from "../components";
import type { Film } from "../types";

/**
 * FilmListPage Component
 * Displays a list of all films with edit and delete actions
 */
const FilmListPage = () => {
  const navigate = useNavigate();
  const { data: films, isLoading, error } = useFilms();
  const deleteFilmMutation = useDeleteFilm();
  const { showError, showSuccess } = useToast();
  
  const [filmToDelete, setFilmToDelete] = useState<Film | null>(null);

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load films";
      showError(errorMessage);
    }
  }, [error, showError]);

  const handleEdit = (filmId: string) => {
    navigate(`/films/${filmId}/edit`);
  };

  const handleDeleteClick = (film: Film) => {
    setFilmToDelete(film);
  };

  const handleConfirmDelete = () => {
    if (filmToDelete) {
      deleteFilmMutation.mutate(filmToDelete.film_id, {
        onSuccess: () => {
          setFilmToDelete(null);
          showSuccess(`Film "${filmToDelete.title}" deleted successfully`);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || "Failed to delete film";
          showError(errorMessage);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setFilmToDelete(null);
  };

  const handleCreateNew = () => {
    navigate("/films/new");
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading films..." />;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Films</h1>
            <button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
              onClick={handleCreateNew}
            >
              Create New Film
            </button>
          </div>

          {films && films.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No films found. Create your first film!</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {films?.map((film) => (
                    <tr key={film.film_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{film.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{film.rating}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{film.release_year || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {film.description || "No description"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
                          onClick={() => handleEdit(film.film_id)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition disabled:opacity-50"
                          onClick={() => handleDeleteClick(film)}
                          disabled={deleteFilmMutation.isPending}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <ConfirmDialog
            isOpen={!!filmToDelete}
            title="Delete Film"
            message={`Are you sure you want to delete "${filmToDelete?.title}"? This action cannot be undone.`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            isLoading={deleteFilmMutation.isPending}
          />
        </div>
      </div>
    </>
  );
};

export default FilmListPage;
