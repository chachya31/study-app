import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import {
  LoginPage,
  FilmListPage,
  FilmFormPage,
  ActorListPage,
  ActorFormPage,
} from './pages';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ConfirmSignUpPage from './pages/ConfirmSignUpPage';

/**
 * Create QueryClient instance for TanStack Query
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Main App Component
 * Sets up routing for the Film and Actor management system
 * 
 * Routes:
 * - /login: Login page (public)
 * - /films: Film list page (protected)
 * - /films/new: Create new film (protected)
 * - /films/:id/edit: Edit existing film (protected)
 * - /actors: Actor list page (protected)
 * - /actors/new: Create new actor (protected)
 * - /actors/:id/edit: Edit existing actor (protected)
 * - /: Redirects to /films
 * 
 * Requirements: 6.1
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/confirm-signup" element={<ConfirmSignUpPage />} />

            {/* Protected routes - Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Films */}
            <Route
              path="/films"
              element={
                <ProtectedRoute>
                  <FilmListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/films/new"
              element={
                <ProtectedRoute>
                  <FilmFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/films/:id/edit"
              element={
                <ProtectedRoute>
                  <FilmFormPage />
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Actors */}
            <Route
              path="/actors"
              element={
                <ProtectedRoute>
                  <ActorListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/actors/new"
              element={
                <ProtectedRoute>
                  <ActorFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/actors/:id/edit"
              element={
                <ProtectedRoute>
                  <ActorFormPage />
                </ProtectedRoute>
              }
            />

            {/* Default redirect to films */}
            <Route path="/" element={<Navigate to="/films" replace />} />

            {/* Catch-all route - redirect to films */}
            <Route path="*" element={<Navigate to="/films" replace />} />
          </Routes>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
