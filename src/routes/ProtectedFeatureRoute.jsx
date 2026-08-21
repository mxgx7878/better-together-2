import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectIsAdmin,
  selectIsProvider,
  selectIsParticipant,
  selectHasFeature,
} from "../store/slices/authSlice";

const ProtectedFeatureRoute = ({ featureKey, children }) => {
  const location        = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin         = useSelector(selectIsAdmin);
  const isProvider      = useSelector(selectIsProvider);
  const isParticipant   = useSelector(selectIsParticipant);
  const hasFeature      = useSelector(selectHasFeature(featureKey));

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (isAdmin || hasFeature) return children;

  const upgradePath = isProvider
    ? "/provider/upgrade"
    : isParticipant
      ? "/participant/upgrade"
      : "/subscription";
  return <Navigate to={upgradePath} replace />;
};

export default ProtectedFeatureRoute;