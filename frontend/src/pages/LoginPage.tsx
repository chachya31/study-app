import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts";
import { useLoginStore } from "../stores";
import { useEffect } from "react";

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
    username, 
    password, 
    errors, 
    isSubmitting,
    setUsername, 
    setPassword, 
    validate, 
    setSubmitting, 
    reset 
  } = useLoginStore();

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
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      await login({ username, password });
      showSuccess("Login successful!");
      reset();
      // Navigation will happen automatically via useEffect when isAuthenticated changes
    } catch (err: any) {
      // Check if error is due to unconfirmed user
      const errorMessage = err.detail || "ログインに失敗しました";
      if (err.status == 401 && (errorMessage.includes("確認されていません") || errorMessage.includes("UserNotConfirmed"))) {
        showError("ユーザーが確認されていません。確認ページに移動します。");
        navigate("/confirm-signup", { state: { username } });
      } else {
        // Error is handled by the auth context and displayed via toast
        console.error("Login failed:", err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Film & Actor Management</h1>
        <h2 className="text-xl text-center text-gray-600 mb-6">ログイン</h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              ユーザー名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isSubmitting}
              autoComplete="username"
            />
            {errors.username && (
              <span className="text-red-500 text-sm mt-1 block">{errors.username}</span>
            )}
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>
            )}
          </div>

          {/* API error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>

          {/* Additional links */}
          <div className="text-center mt-4 space-y-2">
            <div>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                パスワードを忘れた場合
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
