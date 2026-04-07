import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RoleGuard = ({ allowedRoles = [], requirePaid = false, children }) => {
  const { user, isPaid } = useAuth();

  // Check role access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check paid tier access
  if (requirePaid && !isPaid) {
    return <Navigate to="/dashboard/upgrade" replace />;
  }

  return children;
};

export default RoleGuard;
