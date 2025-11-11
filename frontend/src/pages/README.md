# Pages

This directory contains all page-level components for the application.

## Available Pages

### LoginPage

The login page component that provides user authentication.

**Features:**
- Username and password input form
- Form validation using React Hook Form
- Error message display
- Automatic redirect to `/films` on successful login
- Integration with AuthContext for authentication state management

**Usage:**

```tsx
import { LoginPage } from './pages';

// In your router configuration (see task 19):
<Route path="/login" element={<LoginPage />} />
```

**Requirements:**
- Requirements 6.1, 6.2, 6.7
- Uses React Hook Form for form management
- Integrates with AuthContext and authService
- Displays validation errors and API errors

**Form Validation:**
- Username: Required, minimum 3 characters
- Password: Required, minimum 6 characters

**Behavior:**
- On successful login: Saves token to localStorage and redirects to `/films`
- On failed login: Displays error message from API
- If already authenticated: Automatically redirects to `/films`

## Future Pages

The following pages will be implemented in subsequent tasks:

- FilmListPage (Task 17.2)
- FilmFormPage (Task 17.3)
- ActorListPage (Task 18.2)
- ActorFormPage (Task 18.3)
