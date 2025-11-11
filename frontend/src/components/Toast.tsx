import { useEffect } from "react";

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

  const typeStyles = {
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div 
      className={`flex items-center justify-between p-4 mb-3 border rounded-lg shadow-lg min-w-[300px] max-w-md ${typeStyles[type]}`} 
      role="alert"
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl font-bold">{getIcon(type)}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button 
        className="ml-4 text-2xl font-bold hover:opacity-70 transition" 
        onClick={handleClose} 
        aria-label="Close"
      >
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
