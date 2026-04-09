import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';

// For pages like Login that should redirect if already authenticated
const PublicRoute = ({ restricted = false }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (restricted && isAuthenticated && user) {
    const redirectMap = {
      admin: '/admin',
      provider: '/provider',
      participant: '/participant',
    };
    const role = (user.role || '').toLowerCase();
    return <Navigate to={redirectMap[role] || '/'} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
