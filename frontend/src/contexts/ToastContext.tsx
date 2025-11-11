import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import ToastContainer from "../components/ToastContainer";
import type { ToastType } from "../components/Toast";

/**
 * ToastContext
 * Provides global toast notification management
 * Requirements: 6.7, 8.3
 */

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = { id, message, type, duration };
      
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const showError = useCallback(
    (message: string, duration = 5000) => {
      showToast(message, "error", duration);
    },
    [showToast]
  );

  const showSuccess = useCallback(
    (message: string, duration = 5000) => {
      showToast(message, "success", duration);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, duration = 5000) => {
      showToast(message, "info", duration);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, duration = 5000) => {
      showToast(message, "warning", duration);
    },
    [showToast]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{ showToast, showError, showSuccess, showInfo, showWarning }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};
