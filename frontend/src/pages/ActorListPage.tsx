import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActors, useDeleteActor } from "../hooks";
import { useToast } from "../contexts";
import { ConfirmDialog, LoadingSpinner, Header } from "../components";
import type { Actor } from "../types";
import "./ActorListPage.css";

/**
 * ActorListPage Component
 * Displays a list of all actors with edit and delete actions
 */
const ActorListPage = () => {
  const navigate = useNavigate();
  const { data: actors, isLoading, error } = useActors();
  const deleteActorMutation = useDeleteActor();
  const { showError, showSuccess } = useToast();
  
  const [actorToDelete, setActorToDelete] = useState<Actor | null>(null);

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load actors";
      showError(errorMessage);
    }
  }, [error, showError]);

  const handleEdit = (actorId: string) => {
    navigate(`/actors/${actorId}/edit`);
  };

  const handleDeleteClick = (actor: Actor) => {
    setActorToDelete(actor);
  };

  const handleConfirmDelete = () => {
    if (actorToDelete) {
      deleteActorMutation.mutate(actorToDelete.actor_id, {
        onSuccess: () => {
          setActorToDelete(null);
          showSuccess(`Actor "${actorToDelete.first_name} ${actorToDelete.last_name}" deleted successfully`);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || "Failed to delete actor";
          showError(errorMessage);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setActorToDelete(null);
  };

  const handleCreateNew = () => {
    navigate("/actors/new");
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading actors..." />;
  }

  return (
    <>
      <Header />
      <div className="actor-list-page">
        <div className="page-header">
          <h1>Actors</h1>
          <button className="btn btn-primary" onClick={handleCreateNew}>
            Create New Actor
          </button>
        </div>

      {actors && actors.length === 0 ? (
        <div className="empty-state">
          <p>No actors found. Create your first actor!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="actors-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Last Update</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {actors?.map((actor) => (
                <tr key={actor.actor_id}>
                  <td>{actor.first_name}</td>
                  <td>{actor.last_name}</td>
                  <td>{new Date(actor.last_update).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(actor.actor_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(actor)}
                      disabled={deleteActorMutation.isPending}
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
        isOpen={!!actorToDelete}
        title="Delete Actor"
        message={`Are you sure you want to delete "${actorToDelete?.first_name} ${actorToDelete?.last_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteActorMutation.isPending}
      />
      </div>
    </>
  );
};

export default ActorListPage;
