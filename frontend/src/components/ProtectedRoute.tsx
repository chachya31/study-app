import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

/**
 * Protected Route Props
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute Component
 * Wrapper component that protects routes requiring authentication
 * 
 * Redirects to login page if user is not authenticated
 * Shows loading state while checking authentication
 * 
 * Requirements: 6.1
 * 
 * @param children - Child components to render if authenticated
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <div>読み込み中...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};
