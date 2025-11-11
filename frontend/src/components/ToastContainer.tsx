import Toast from "./Toast";
import type { ToastProps } from "./Toast";
import "./ToastContainer.css";

/**
 * ToastContainer Component
 * Container for displaying multiple toast notifications
 * Requirements: 6.7, 8.3
 */

interface ToastContainerProps {
  toasts: Omit<ToastProps, "onClose">[];
  onClose: (id: string) => void;
}

const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default ToastContainer;
