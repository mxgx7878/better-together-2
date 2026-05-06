// ─── useFeatureAccess ─────────────────────────────────────────────
// Single source of truth for "can the current user use feature X?".
//
// Usage:
//   const { hasAccess, planName, featureValue, reason } =
//     useFeatureAccess('priority_listing');
//
//   if (!hasAccess) return <UpgradePrompt />;
//
// Rules (in order):
//   1. Admins always have access (reason: 'admin')
//   2. Logged-out users never have access (reason: 'not_authenticated')
//   3. If featureKey provided AND user's plan features are loaded →
//      check membership by feature_key (reason: 'has_feature' | 'missing_feature')
//   4. Fallback (no featureKey OR features not loaded) → use the
//      binary tier check, paid = access (reason: 'paid_tier' | 'free_tier')
//
// The hook is tolerant about where the plan lives in the user object.
// It looks in (in order): user.subscription, user.current_subscription,
// user.plan, user.subscriptionPlan (only if it's an object — string is
// treated as legacy and ignored).

import { useSelector } from "react-redux";
import {
  selectUser,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsPaid,
} from "../store/slices/authSlice";

const getUserPlan = (user) => {
  if (!user) return null;
  // Try the most-likely shapes the backend might return
  if (user.subscription && typeof user.subscription === "object") {
    return user.subscription;
  }
  if (
    user.current_subscription &&
    typeof user.current_subscription === "object"
  ) {
    return user.current_subscription;
  }
  if (user.plan && typeof user.plan === "object") {
    return user.plan;
  }
  if (user.subscriptionPlan && typeof user.subscriptionPlan === "object") {
    return user.subscriptionPlan;
  }
  return null;
};

const getPlanFeatures = (plan) => {
  if (!plan) return [];
  if (Array.isArray(plan.features)) return plan.features;
  return [];
};

export const useFeatureAccess = (featureKey) => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const isPaid = useSelector(selectIsPaid);

  // 1. Admin bypass
  if (isAdmin) {
    return {
      hasAccess: true,
      reason: "admin",
      planName: "Admin",
      featureValue: null,
    };
  }

  // 2. Not logged in
  if (!isAuthenticated || !user) {
    return {
      hasAccess: false,
      reason: "not_authenticated",
      planName: null,
      featureValue: null,
    };
  }

  const plan = getUserPlan(user);
  const planFeatures = getPlanFeatures(plan);
  const planName =
    plan?.name ||
    (typeof user.subscriptionPlan === "string" ? user.subscriptionPlan : null);

  // 3. Feature-level check (only when we have both a key and feature data)
  if (featureKey && planFeatures.length > 0) {
    const feature = planFeatures.find((f) => f.feature_key === featureKey);
    if (feature) {
      return {
        hasAccess: true,
        reason: "has_feature",
        planName,
        featureValue: feature.value ?? null,
      };
    }
    return {
      hasAccess: false,
      reason: "missing_feature",
      planName,
      featureValue: null,
    };
  }

  // 4. Fallback: tier-based binary check
  return {
    hasAccess: isPaid,
    reason: isPaid ? "paid_tier" : "free_tier",
    planName,
    featureValue: null,
  };
};

export default useFeatureAccess;