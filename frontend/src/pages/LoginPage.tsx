import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts";
import type { LoginRequest } from "../types";
import { useEffect } from "react";
import "./LoginPage.css";

/**
 * LoginPage Component
 * Provides user authentication interface
 * 
 * Features:
 * - Username and password input form
 * - Form validation using React Hook Form
 * - Error message display
 * - Redirect to home page on successful login
 * 
 * Requirements: 6.1, 6.2
 */
export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error, clearError } = useAuthContext();
  const { showError, showSuccess } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  // Show error toast when there's a login error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  /**
   * Redirect to home if already authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/films");
    }
  }, [isAuthenticated, navigate]);

  /**
   * Clear error when component unmounts
   */
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  /**
   * Handle form submission
   * Authenticates user and redirects on success
   * 
   * Requirements: 6.2, 6.7
   */
  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      showSuccess("Login successful!");
      // Navigation will happen automatically via useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled by the auth context and displayed via toast
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Film & Actor Management</h1>
        <h2 className="login-subtitle">ログイン</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {/* Username field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              ユーザー名
            </label>
            <input
              id="username"
              type="text"
              className={`form-input ${errors.username ? "form-input-error" : ""}`}
              {...register("username", {
                required: "ユーザー名は必須です",
                minLength: {
                  value: 3,
                  message: "ユーザー名は3文字以上である必要があります",
                },
              })}
              disabled={isSubmitting}
              autoComplete="username"
            />
            {errors.username && (
              <span className="form-error">{errors.username.message}</span>
            )}
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? "form-input-error" : ""}`}
              {...register("password", {
                required: "パスワードは必須です",
                minLength: {
                  value: 6,
                  message: "パスワードは6文字以上である必要があります",
                },
              })}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>

          {/* API error message */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
