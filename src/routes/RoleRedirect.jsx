import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';

// Redirects authenticated users to their role-based dashboard
const RoleRedirect = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const redirectMap = {
    admin: '/admin',
    provider: '/provider',
    participant: '/participant',
  };

  const role = (user?.role || '').toLowerCase();
  return <Navigate to={redirectMap[role] || '/'} replace />;
};

export default RoleRedirect;
