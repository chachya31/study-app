import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useActor, useCreateActor, useUpdateActor } from "../hooks";
import { useToast } from "../contexts";
import { LoadingSpinner, Header } from "../components";
import type { ActorCreateRequest, ActorUpdateRequest } from "../types";
import "./ActorFormPage.css";

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
      <div className="actor-form-page">
        <div className="form-container">
          <h1>{isEditMode ? "Edit Actor" : "Create New Actor"}</h1>

        {error && (
          <div className="error-message">
            Error: {error instanceof Error ? error.message : "Failed to save actor"}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="actor-form">
          <div className="form-group">
            <label htmlFor="first_name">
              First Name <span className="required">*</span>
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
              className={errors.first_name ? "error" : ""}
            />
            {errors.first_name && (
              <span className="error-text">{errors.first_name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">
              Last Name <span className="required">*</span>
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
              className={errors.last_name ? "error" : ""}
            />
            {errors.last_name && (
              <span className="error-text">{errors.last_name.message}</span>
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
              {isPending ? "Saving..." : isEditMode ? "Update Actor" : "Create Actor"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default ActorFormPage;
