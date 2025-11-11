import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActors, useDeleteActor } from "../hooks";
import { useToast } from "../contexts";
import { ConfirmDialog, LoadingSpinner, Header } from "../components";
import type { Actor } from "../types";

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Actors</h1>
            <button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
              onClick={handleCreateNew}
            >
              Create New Actor
            </button>
          </div>

          {actors && actors.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No actors found. Create your first actor!</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {actors?.map((actor) => (
                    <tr key={actor.actor_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{actor.first_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{actor.last_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(actor.last_update).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
                          onClick={() => handleEdit(actor.actor_id)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition disabled:opacity-50"
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
      </div>
    </>
  );
};

export default ActorListPage;
