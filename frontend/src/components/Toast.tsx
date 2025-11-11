import { useEffect } from "react";
import "./Toast.css";

/**
 * Toast Component
 * Displays temporary notification messages for errors, success, and info
 * Requirements: 6.7, 8.3
 */

export type ToastType = "error" | "success" | "info" | "warning";

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast = ({ id, message, type, duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    onClose(id);
  };

  return (
    <div className={`toast toast-${type}`} role="alert">
      <div className="toast-content">
        <span className="toast-icon">{getIcon(type)}</span>
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={handleClose} aria-label="Close">
        ×
      </button>
    </div>
  );
};

const getIcon = (type: ToastType): string => {
  switch (type) {
    case "error":
      return "✕";
    case "success":
      return "✓";
    case "warning":
      return "⚠";
    case "info":
      return "ℹ";
    default:
      return "ℹ";
  }
};

export default Toast;
