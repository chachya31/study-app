import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFilms, useDeleteFilm } from "../hooks";
import { useToast } from "../contexts";
import { ConfirmDialog, LoadingSpinner, Header } from "../components";
import type { Film } from "../types";
import "./FilmListPage.css";

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
      <div className="film-list-page">
        <div className="page-header">
          <h1>Films</h1>
          <button className="btn btn-primary" onClick={handleCreateNew}>
            Create New Film
          </button>
        </div>

      {films && films.length === 0 ? (
        <div className="empty-state">
          <p>No films found. Create your first film!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="films-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Rating</th>
                <th>Release Year</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {films?.map((film) => (
                <tr key={film.film_id}>
                  <td>{film.title}</td>
                  <td>{film.rating}</td>
                  <td>{film.release_year || "N/A"}</td>
                  <td className="description-cell">
                    {film.description || "No description"}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(film.film_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
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
    </>
  );
};

export default FilmListPage;
