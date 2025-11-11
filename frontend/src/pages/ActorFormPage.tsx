import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useActor, useCreateActor, useUpdateActor } from "../hooks";
import { useToast } from "../contexts";
import { LoadingSpinner, Header } from "../components";
import type { ActorCreateRequest, ActorUpdateRequest } from "../types";

/**
 * ActorFormPage Component
 * Form for creating and editing actors
 */

interface ActorFormData {
  first_name: string;
  last_name: string;
}

const ActorFormPage = () => {
  const navigate = useNavigate();
  const { id: actorId } = useParams<{ id: string }>();
  const isEditMode = !!actorId;
  const { showError, showSuccess } = useToast();

  // Fetch actor data if in edit mode
  const { data: actor, isLoading: isLoadingActor, error: loadError } = useActor(actorId || "");
  
  // Mutations
  const createActorMutation = useCreateActor();
  const updateActorMutation = useUpdateActor();

  // Show error toast when there's a loading error
  useEffect(() => {
    if (loadError) {
      const errorMessage = loadError instanceof Error ? loadError.message : "Failed to load actor";
      showError(errorMessage);
    }
  }, [loadError, showError]);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ActorFormData>({
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (actor && isEditMode) {
      reset({
        first_name: actor.first_name,
        last_name: actor.last_name,
      });
    }
  }, [actor, isEditMode, reset]);

  const onSubmit = async (data: ActorFormData) => {
    try {
      if (isEditMode && actorId) {
        // Update existing actor
        const updateData: ActorUpdateRequest = {
          first_name: data.first_name,
          last_name: data.last_name,
        };
        
        await updateActorMutation.mutateAsync({
          actorId,
          actorData: updateData,
        });
        showSuccess("Actor updated successfully");
      } else {
        // Create new actor
        const createData: ActorCreateRequest = {
          first_name: data.first_name,
          last_name: data.last_name,
        };
        
        await createActorMutation.mutateAsync(createData);
        showSuccess("Actor created successfully");
      }
      
      // Navigate back to actors list on success
      navigate("/actors");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to save actor";
      showError(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/actors");
  };

  if (isEditMode && isLoadingActor) {
    return <LoadingSpinner fullScreen message="Loading actor data..." />;
  }

  const isPending = createActorMutation.isPending || updateActorMutation.isPending;
  const error = createActorMutation.error || updateActorMutation.error;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {isEditMode ? "Edit Actor" : "Create New Actor"}
            </h1>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                Error: {error instanceof Error ? error.message : "Failed to save actor"}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="first_name"
                  type="text"
                  {...register("first_name", {
                    required: "First name is required",
                    minLength: {
                      value: 1,
                      message: "First name cannot be empty",
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.first_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.first_name && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.first_name.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="last_name"
                  type="text"
                  {...register("last_name", {
                    required: "Last name is required",
                    minLength: {
                      value: 1,
                      message: "Last name cannot be empty",
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.last_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.last_name && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.last_name.message}</span>
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
                  {isPending ? "Saving..." : isEditMode ? "Update Actor" : "Create Actor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActorFormPage;
