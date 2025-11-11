import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import './Header.css';

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
    // TODO: Navigate to user info page when implemented
    alert(`ユーザー情報:\nユーザー名: ${user?.username}\nメール: ${user?.email || '未設定'}`);
  };

  if (!user) {
    return null;
  }

  const isFilmsPage = location.pathname.startsWith('/films');
  const isActorsPage = location.pathname.startsWith('/actors');

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="header-title">Film & Actor Management</h1>
          <nav className="header-nav">
            <button 
              className={`nav-link ${isFilmsPage ? 'active' : ''}`}
              onClick={() => navigate('/films')}
            >
              Films
            </button>
            <button 
              className={`nav-link ${isActorsPage ? 'active' : ''}`}
              onClick={() => navigate('/actors')}
            >
              Actors
            </button>
          </nav>
        </div>
        <div className="header-right">
          <span className="user-name">{user.username}</span>
          <button 
            className="btn-user-info" 
            onClick={handleUserInfo}
            title="ユーザー情報"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button 
            className="btn-logout" 
            onClick={handleLogout}
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
};
