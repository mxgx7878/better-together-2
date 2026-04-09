import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';

// Protects routes that require authentication
// Optionally restricts by role(s)
const ProtectedRoute = ({ allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectMap = {
      admin: '/admin',
      provider: '/provider',
      participant: '/participant',
    };
    return <Navigate to={redirectMap[user?.role] || '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
