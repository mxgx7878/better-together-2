import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectIsAdmin,
  selectIsPaid,
  selectIsProvider,
  selectIsParticipant,
  selectHasFeature,
  selectSubscriptionLoading,
  selectSubscriptionReady,
} from "../../store/slices/authSlice";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

// ─── FeatureGate ──────────────────────────────────────────────────
// Wraps content that requires either:
//   (a) a specific feature_key from the user's plan, OR
//   (b) any paid plan (fallback when no featureKey is passed).
//
// Gating rules (in order):
//   - Admins always pass through
//   - Subscription data still loading → spinner (NOT lock screen)
//   - featureKey provided → checks plan.features[]
//   - featureKey omitted  → falls back to binary isPaid check
//
// All plan reads go through cross-slice selectors that prefer
// state.subscription.mySubscription over state.auth.user.subscriber.
// This means the gate only commits to a decision AFTER /subscription/me
// has returned — fixing the "flashes lock screen on page load" bug.
// ──────────────────────────────────────────────────────────────────
const FeatureGate = ({
  children,
  fallback,
  featureName = "This feature",
  featureKey,
}) => {
  const isAdmin       = useSelector(selectIsAdmin);
  const isPaid        = useSelector(selectIsPaid);
  const isProvider    = useSelector(selectIsProvider);
  const isParticipant = useSelector(selectIsParticipant);
  const loading       = useSelector(selectSubscriptionLoading);
  const ready         = useSelector(selectSubscriptionReady);
  const hasFeature    = useSelector(
    featureKey ? selectHasFeature(featureKey) : () => false,
  );

  // 1. Admin — always allowed
  if (isAdmin) return children;

  // 2. Subscription data still being fetched — show spinner, NOT lock.
  //    This is the fix for the flicker bug: previously the gate would
  //    render the upgrade screen with stale data, then swap to the real
  //    content once /subscription/me completed.
  if (loading || !ready) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
      </div>
    );
  }

  // 3. Gating decision
  const allowed = featureKey ? hasFeature : isPaid;
  if (allowed) return children;
  if (fallback) return fallback;

  // 4. Upgrade prompt
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