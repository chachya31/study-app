import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmSignUp, resendConfirmationCode } from "../services/authService";
import { useToast } from "../contexts";

/**
 * ConfirmSignUpPage Component
 * Provides user confirmation interface for verifying email with confirmation code
 * 
 * Features:
 * - Confirmation code input
 * - Resend confirmation code functionality
 * - Form validation
 * - Error and success message display
 */
export const ConfirmSignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showError, showSuccess } = useToast();
  
  // Get username from navigation state or empty string
  const [username, setUsername] = useState<string>(
    (location.state as { username?: string })?.username || ""
  );
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; confirmationCode?: string }>({});

  /**
   * Validate form inputs
   */
  const validate = (): boolean => {
    const newErrors: { username?: string; confirmationCode?: string } = {};

    if (!username.trim()) {
      newErrors.username = "ユーザー名を入力してください";
    }

    if (!confirmationCode.trim()) {
      newErrors.confirmationCode = "確認コードを入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * Confirms user registration with the provided code
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await confirmSignUp({ username, confirmation_code: confirmationCode });
      showSuccess(response.message);
      // Redirect to login page after successful confirmation
      setTimeout(() => {
        navigate("/login", { state: { username } });
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "確認に失敗しました";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle resend confirmation code
   * Sends a new confirmation code to user's email
   */
  const handleResendCode = async () => {
    if (!username.trim()) {
      showError("ユーザー名を入力してください");
      return;
    }

    setIsResending(true);
    try {
      const response = await resendConfirmationCode({ username });
      showSuccess(`${response.message} (送信先: ${response.destination})`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "確認コードの再送信に失敗しました";
      showError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          ユーザー確認
        </h1>
        <p className="text-center text-gray-600 mb-6">
          メールに送信された確認コードを入力してください
        </p>

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

          {/* Confirmation code field */}
          <div>
            <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700 mb-1">
              確認コード
            </label>
            <input
              id="confirmationCode"
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.confirmationCode ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isSubmitting}
              placeholder="123456"
            />
            {errors.confirmationCode && (
              <span className="text-red-500 text-sm mt-1 block">{errors.confirmationCode}</span>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "確認中..." : "確認"}
          </button>

          {/* Resend code button */}
          <button
            type="button"
            onClick={handleResendCode}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isResending || isSubmitting}
          >
            {isResending ? "送信中..." : "確認コードを再送信"}
          </button>

          {/* Back to login link */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              ログインページに戻る
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmSignUpPage;
