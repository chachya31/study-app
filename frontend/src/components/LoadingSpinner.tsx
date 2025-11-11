

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
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-12 h-12 border-4",
    large: "w-16 h-16 border-4",
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? "min-h-screen" : "p-8"}`}>
      <div className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}></div>
      {message && <p className="mt-4 text-gray-600 text-sm">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">{content}</div>;
  }

  return content;
};

export default LoadingSpinner;
