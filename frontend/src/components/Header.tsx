import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

/**
 * Header Component
 * Common header displayed across all authenticated pages
 * Shows logged-in user name, user info button, and logout button
 */
export const Header = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUserInfo = () => {
    navigate('/profile');
  };

  if (!user) {
    return null;
  }

  const isFilmsPage = location.pathname.startsWith('/films');
  const isActorsPage = location.pathname.startsWith('/actors');

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-800">Film & Actor Management</h1>
            <nav className="flex space-x-4">
              <button 
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isFilmsPage 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => navigate('/films')}
              >
                Films
              </button>
              <button 
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActorsPage 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => navigate('/actors')}
              >
                Actors
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">{user.username}</span>
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition" 
              onClick={handleUserInfo}
              title="ユーザー情報"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition" 
              onClick={handleLogout}
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
