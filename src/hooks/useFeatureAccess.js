// ─── useFeatureAccess ─────────────────────────────────────────────
// Single source of truth for "can the current user use feature X?".
//
// Usage:
//   const { hasAccess, loading, planName, featureValue, reason } =
//     useFeatureAccess('priority_listing');
//
//   if (loading) return <Spinner />;
//   if (!hasAccess) return <UpgradePrompt />;
//
// Rules (in order):
//   1. Admins always have access (reason: 'admin')
//   2. Subscription data still loading → loading=true (reason: 'loading')
//   3. Logged-out users never have access (reason: 'not_authenticated')
//   4. If featureKey provided AND plan features are loaded →
//      check membership by feature_key (reason: 'has_feature' | 'missing_feature')
//   5. Fallback (no featureKey OR features not loaded) → use the
//      binary tier check, paid = access (reason: 'paid_tier' | 'free_tier')
//
// All plan data is read via selectCurrentPlan, which is cross-slice —
// it prefers state.subscription.mySubscription.plan (freshest from
// /subscription/me) over state.auth.user.subscriber.plan (warm fallback).
// This eliminates the "lock screen flash" bug where the gate would render
// with stale localStorage data before /subscription/me completed.

import { useSelector } from "react-redux";
import {
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsPaid,
  selectCurrentPlan,
  selectSubscriptionLoading,
  selectSubscriptionReady,
} from "../store/slices/authSlice";

const getPlanFeatures = (plan) => {
  if (!plan) return [];
  if (!Array.isArray(plan.features)) return [];
  // Status undefined or true → enabled. Only explicit false/0 disables.
  return plan.features.filter((f) => f.status !== false && f.status !== 0);
};

export const useFeatureAccess = (featureKey) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin         = useSelector(selectIsAdmin);
  const isPaid          = useSelector(selectIsPaid);
  const plan            = useSelector(selectCurrentPlan);
  const loading         = useSelector(selectSubscriptionLoading);
  const ready           = useSelector(selectSubscriptionReady);

  // 1. Admin bypass — never blocked, never loading
  if (isAdmin) {
    return {
      hasAccess: true,
      loading: false,
      reason: "admin",
      planName: "Admin",
      featureValue: null,
    };
  }

  // 2. Still fetching the subscription for the first time — don't commit
  //    to an answer yet. The caller (FeatureGate / page) should render a
  //    loading state, NOT the upgrade prompt.
  if (loading || !ready) {
    return {
      hasAccess: false,
      loading: true,
      reason: "loading",
      planName: null,
      featureValue: null,
    };
  }

  // 3. Not logged in
  if (!isAuthenticated) {
    return {
      hasAccess: false,
      loading: false,
      reason: "not_authenticated",
      planName: null,
      featureValue: null,
    };
  }

  const planFeatures = getPlanFeatures(plan);
  const planName = plan?.name || null;

  // 4. Feature-level check (when we have both a key and feature data)
  if (featureKey && planFeatures.length > 0) {
    const feature = planFeatures.find((f) => f.feature_key === featureKey);
    if (feature) {
      return {
        hasAccess: true,
        loading: false,
        reason: "has_feature",
        planName,
        featureValue: feature.pivot?.value ?? feature.value ?? null,
      };
    }
    return {
      hasAccess: false,
      loading: false,
      reason: "missing_feature",
      planName,
      featureValue: null,
    };
  }

  // 5. Fallback: tier-based binary check
  return {
    hasAccess: isPaid,
    loading: false,
    reason: isPaid ? "paid_tier" : "free_tier",
    planName,
    featureValue: null,
  };
};

export default useFeatureAccess;