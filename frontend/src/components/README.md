# Components

This directory contains reusable React components used throughout the application.

## Structure
- Shared UI components (buttons, forms, modals, etc.)
- Layout components
- Feature-specific components

## Available Components

### ConfirmDialog
A reusable confirmation dialog for destructive actions.

**Usage:**
```tsx
<ConfirmDialog
  isOpen={isOpen}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  isLoading={isDeleting}
/>
```

### LoadingSpinner
Displays a loading spinner during data fetching operations.

**Props:**
- `size`: "small" | "medium" | "large" (default: "medium")
- `message`: Optional loading message
- `fullScreen`: Boolean to display as full-screen overlay (default: false)

**Usage:**
```tsx
// Inline spinner
<LoadingSpinner size="small" message="Loading..." />

// Full-screen spinner
<LoadingSpinner fullScreen message="Loading data..." />
```

### Toast / ToastContainer
Toast notification system for displaying temporary messages.

**Note:** Toast notifications are managed globally through the `ToastContext`. Use the `useToast` hook to display toasts.

**Usage:**
```tsx
import { useToast } from "../contexts";

const MyComponent = () => {
  const { showError, showSuccess, showInfo, showWarning } = useToast();

  const handleAction = async () => {
    try {
      await someAction();
      showSuccess("Action completed successfully!");
    } catch (error) {
      showError("Failed to complete action");
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
};
```

### ProtectedRoute
Wrapper component that requires authentication to access a route.

**Usage:**
```tsx
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  }
/>
```
