import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import PageLoader from '../ui/PageLoader';

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loader while auth state is being determined
  if (isAuthenticated === null) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
