import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';

const ProtectedRoute = ({ allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();

  // Not logged in → go to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = (user.role || '').toLowerCase();

  // Role check (case-insensitive)
  if (allowedRoles && allowedRoles.length > 0) {
    const allowed = allowedRoles.map((r) => r.toLowerCase());
    if (!allowed.includes(userRole)) {
      // Redirect to their own dashboard
      const redirectMap = {
        admin: '/admin',
        provider: '/provider',
        participant: '/participant',
      };
      return <Navigate to={redirectMap[userRole] || '/'} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
