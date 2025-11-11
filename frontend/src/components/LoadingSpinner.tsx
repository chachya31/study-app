import "./LoadingSpinner.css";

/**
 * LoadingSpinner Component
 * Displays a loading spinner during data fetching operations
 * Requirements: 6.6
 */

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({
  size = "medium",
  message,
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const content = (
    <div className={`loading-spinner-content ${fullScreen ? "fullscreen" : ""}`}>
      <div className={`spinner spinner-${size}`}>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="loading-spinner-overlay">{content}</div>;
  }

  return content;
};

export default LoadingSpinner;
