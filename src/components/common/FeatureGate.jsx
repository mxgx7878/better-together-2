import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectIsAdmin,
  selectIsPaid,
  selectIsProvider,
  selectIsParticipant,
  selectHasFeature,
} from "../../store/slices/authSlice";
import { Lock, ArrowRight } from "lucide-react";

// Wraps content that requires either (a) a specific feature_key, or
// (b) any paid plan as a fallback when no featureKey is passed.
// - Admins always pass through
// - featureKey provided → checks user's plan.features[]
// - featureKey omitted  → falls back to binary isPaid check (legacy)
const FeatureGate = ({ children, fallback, featureName = "This feature", featureKey }) => {
  const isAdmin       = useSelector(selectIsAdmin);
  const isPaid        = useSelector(selectIsPaid);
  const isProvider    = useSelector(selectIsProvider);
  const isParticipant = useSelector(selectIsParticipant);
  const hasFeature    = useSelector(featureKey ? selectHasFeature(featureKey) : () => false);

  if (isAdmin) return children;

  const allowed = featureKey ? hasFeature : isPaid;
  if (allowed) return children;
  if (fallback) return fallback;

  const upgradePath = isProvider
    ? "/provider/upgrade"
    : isParticipant
      ? "/participant/upgrade"
      : "/subscription";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-amber-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">
        {featureName} is a paid feature
      </h2>
      <p className="text-slate-500 max-w-md mb-6">
        Upgrade your subscription to unlock this and other premium tools.
      </p>
      <Link
        to={upgradePath}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
      >
        Upgrade Now <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default FeatureGate;