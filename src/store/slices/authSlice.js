import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser, checkAuth } from '../actions/authActions';
import {
  fetchMySubscription,
  changePlan,
  cancelPendingPlan,
  cancelSubscription,
  resumeSubscription,
} from '../actions/subscriptionActions';
import { ASYNC_STATUS } from '../../constants';


// Dummy users kept for demo profile switcher only
const dummyUsers = {
  'admin@together.com': { role: 'admin' },
  'provider.free@test.com': { role: 'provider', tier: 'free' },
  'provider.paid@test.com': { role: 'provider', tier: 'paid' },
  'participant.free@test.com': { role: 'participant', tier: 'free' },
  'participant.paid@test.com': { role: 'participant', tier: 'paid' },
};

// Restore from localStorage on app load
const loadFromStorage = () => {
  try {
    const user = localStorage.getItem('bt_user');
    const token = localStorage.getItem('bt_token');
    if (user && token) {
      return { user: JSON.parse(user), token };
    }
  } catch {
    // ignore
  }
  return { user: null, token: null };
};

const stored = loadFromStorage();

const initialState = {
  user: stored.user,
  token: stored.token,
  isAuthenticated: !!stored.token,
  status: ASYNC_STATUS.IDLE,
  error: null,
  dummyUsers,
};

// Merge subscription data into state.user.subscriber + persist to localStorage.
// Acts as a backup — selectors below also read directly from
// state.subscription.mySubscription, but this keeps localStorage warm
// so the very first render after a reload isn't completely blind.
const patchSubscriber = (state, sub) => {
  if (!sub || !state.user) return;
  state.user = {
    ...state.user,
    subscriber: { ...(state.user.subscriber || {}), ...sub },
  };
  try {
    localStorage.setItem('bt_user', JSON.stringify(state.user));
  } catch {
    // ignore
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    switchProfile(state, action) {
      const email = action.payload;
      const dummy = state.dummyUsers[email];
      if (dummy) {
        const user = {
          ...state.user,
          email,
          role: dummy.role,
          tier: dummy.tier || 'paid',
        };
        state.user = user;
        state.isAuthenticated = true;
        localStorage.setItem('bt_user', JSON.stringify(user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Login ────────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = action.payload;
      })

      // ─── Logout ───────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = ASYNC_STATUS.IDLE;
        state.error = null;
      })

      // ─── Check Auth (GET /user) ───────────────────────────────
      .addCase(checkAuth.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // ─── Subscription syncs ─────────────────────────────────
      .addCase(fetchMySubscription.fulfilled, (state, { payload }) => {
        patchSubscriber(state, payload);
      })
      .addCase(changePlan.fulfilled, (state, { payload }) => {
        const sub = payload?.subscription || payload;
        patchSubscriber(state, sub);
      })
      .addCase(cancelPendingPlan.fulfilled, (state, { payload }) => {
        patchSubscriber(state, payload);
      })
      .addCase(cancelSubscription.fulfilled, (state, { payload }) => {
        patchSubscriber(state, payload);
      })
      .addCase(resumeSubscription.fulfilled, (state, { payload }) => {
        patchSubscriber(state, payload);
      });
  },
});

export const { clearError, switchProfile } = authSlice.actions;

// ═══════════════════════════════════════════════════════════════════
// SUBSCRIPTION ACTIVITY CHECK
// ═══════════════════════════════════════════════════════════════════
// Returns true if the subscription is currently in good standing —
// meaning paid features should actually work for the user.
//
//   - false  → expired status, or period ended without cancel grace,
//              or cancel-grace period has passed
//   - true   → active OR cancelled-but-still-in-grace-period
//
// This is the front-line defence against showing paid features to users
// whose subscription has lapsed. Backend cron runs daily and flips status
// to 'expired', but in the up-to-24h gap before the cron runs, the
// period_end date alone tells us the truth.
// ───────────────────────────────────────────────────────────────────
const isSubscriptionEffectivelyActive = (sub) => {
  if (!sub) return null; // unknown — fall back to other heuristics
  const plan = sub.plan;
  if (!plan) return null;

  // Free plan is "active" by definition (no expiry on free)
  const price = Number(plan.price || 0);
  if (price === 0) return true;

  // Explicit expired status from backend
  if (sub.status === 'expired') return false;

  const now = new Date();

  // Cancelled subscription with a defined end date
  if (sub.cancelled_at && sub.ends_at) {
    const endsAt = new Date(sub.ends_at);
    return now < endsAt;  // Active until ends_at, then expired
  }

  // Standard active path — period date is the source of truth
  if (sub.current_period_end) {
    const periodEnd = new Date(sub.current_period_end);
    return now < periodEnd;
  }

  // Active status with no end date (e.g. lifetime plan)
  return sub.status === 'active';
};

// ═══════════════════════════════════════════════════════════════════
// CROSS-SLICE PLAN RESOLVER
// ═══════════════════════════════════════════════════════════════════
// Resolves the user's CURRENT plan from the freshest source:
//   1. state.subscription.mySubscription.plan   (from /subscription/me)
//   2. state.auth.user.subscriber.plan          (warm cache)
//   3. legacy locations (user.subscription, user.current_subscription, etc.)
// ───────────────────────────────────────────────────────────────────
const resolveRawPlan = (state) => {
  const fresh = state.subscription?.mySubscription?.plan;
  if (fresh && typeof fresh === 'object') return fresh;

  const user = state.auth?.user;
  if (!user) return null;
  if (user.subscriber?.plan && typeof user.subscriber.plan === 'object') return user.subscriber.plan;
  if (user.subscription && typeof user.subscription === 'object') return user.subscription;
  if (user.current_subscription && typeof user.current_subscription === 'object') return user.current_subscription;
  if (user.plan && typeof user.plan === 'object') return user.plan;
  if (user.subscriptionPlan && typeof user.subscriptionPlan === 'object') return user.subscriptionPlan;

  return null;
};

// Effective plan = the plan the user can actually use right now.
// Returns the plan object if active or free, returns null if it's a
// PAID plan that has expired. This is what gating selectors should use.
const resolveEffectivePlan = (state) => {
  const sub = state.subscription?.mySubscription;
  const plan = resolveRawPlan(state);
  if (!plan) return null;

  const price = Number(plan.price || 0);
  if (price === 0) return plan; // Free plan is always "valid"

  // For paid plans: only return them if the subscription is effectively active
  if (sub) {
    const active = isSubscriptionEffectivelyActive(sub);
    if (active === false) return null;
    // active === true OR active === null (unknown) → fall through
  }

  // Warm-cache path: we don't have full subscription data, but we have
  // a plan from auth.user.subscriber. Check whatever date we have.
  const subscriber = sub || state.auth?.user?.subscriber;
  if (subscriber) {
    const active = isSubscriptionEffectivelyActive({ ...subscriber, plan });
    if (active === false) return null;
  }

  return plan;
};

// ═══════════════════════════════════════════════════════════════════
// Selectors
// ═══════════════════════════════════════════════════════════════════

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => (state.auth.user?.role || '').toLowerCase();
export const selectIsProvider = (state) => selectUserRole(state) === 'provider';
export const selectIsParticipant = (state) => selectUserRole(state) === 'participant';
export const selectIsAdmin = (state) => selectUserRole(state) === 'admin';

export const selectIsPending = (state) => { return false; };
export const selectDummyUsers = (state) => state.auth.dummyUsers;

// ─── Plan-aware selectors (all use effectivePlan, which respects expiry) ──
export const selectSubscriber   = (state) => state.subscription?.mySubscription || state.auth?.user?.subscriber || null;
export const selectCurrentPlan  = (state) => resolveEffectivePlan(state);
export const selectPlanName     = (state) => resolveEffectivePlan(state)?.name || null;
export const selectPlanPrice    = (state) => Number(resolveEffectivePlan(state)?.price ?? 0);
export const selectPlanFeatures = (state) => resolveEffectivePlan(state)?.features || [];

export const selectIsFree = (state) => Number(resolveEffectivePlan(state)?.price ?? 0) === 0;
export const selectIsPaid = (state) => Number(resolveEffectivePlan(state)?.price ?? 0) > 0;

// Returns enabled feature_keys from the EFFECTIVE plan (empty if expired).
export const selectPlanFeatureKeys = (state) =>
  (resolveEffectivePlan(state)?.features || [])
    .filter((f) => f.status !== false && f.status !== 0)
    .map((f) => f.feature_key);

// Curried — useSelector(selectHasFeature('innovation_lab')).
// Returns false when the user's subscription has lapsed even if their
// plan_id still technically points to a paid plan in the database.
export const selectHasFeature = (featureKey) => (state) => {
  const role = (state.auth.user?.role || '').toLowerCase();
  if (role === 'admin') return true;
  const features = resolveEffectivePlan(state)?.features || [];
  return features.some(
    (f) => f.feature_key === featureKey && f.status !== false && f.status !== 0,
  );
};

// Curried — useSelector(selectFeatureValue('directory_contacts'))
export const selectFeatureValue = (featureKey) => (state) => {
  const features = resolveEffectivePlan(state)?.features || [];
  const found = features.find((f) => f.feature_key === featureKey);
  return found?.pivot?.value ?? found?.value ?? null;
};

// ─── Subscription state helpers ─────────────────────────────────
// Exposes the raw "is the subscription technically expired" answer so
// the Billing page can show "Expired — renew now" UI even though
// selectCurrentPlan returns null (which would otherwise hide the plan name).
export const selectIsSubscriptionExpired = (state) => {
  const sub = state.subscription?.mySubscription;
  if (!sub) return false;
  return isSubscriptionEffectivelyActive(sub) === false;
};

// ─── Subscription readiness — used by FeatureGate ─────────────────
export const selectSubscriptionReady = (state) => {
  const role = (state.auth.user?.role || '').toLowerCase();
  if (role === 'admin') return true;
  if (state.subscription?.mySubscription) return true;
  if (state.subscription?.myStatus === ASYNC_STATUS.SUCCEEDED) return true;
  if (state.auth?.user?.subscriber?.plan) return true;
  return false;
};

export const selectSubscriptionLoading = (state) => {
  const role = (state.auth.user?.role || '').toLowerCase();
  if (role === 'admin') return false;
  if (selectSubscriptionReady(state)) return false;
  return state.subscription?.myStatus === ASYNC_STATUS.LOADING;
};

export default authSlice.reducer;