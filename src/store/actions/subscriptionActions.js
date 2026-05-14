import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// PUBLIC SUBSCRIPTION API
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/subscriptions
 * No auth required. Only returns active plans (status = 1).
 * Optional filters:
 *   - role: 'participant' | 'provider' | 'both' | 'all'
 *   - billing_cycle: 'monthly' | 'yearly' | 'lifetime'
 *
 * Response shape: { success: true, data: [ { ...plan, features: [...] } ] }
 */
export const fetchPublicSubscriptions = createAsyncThunk(
  "subscriptions/fetchPublicSubscriptions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/subscriptions", { params });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to load subscription plans",
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN SUBSCRIPTION APIs
// ═══════════════════════════════════════════════════════════════════

export const adminFetchSubscriptions = createAsyncThunk(
  "subscriptions/adminFetchSubscriptions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/subscriptions", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch subscriptions");
    }
  },
);

export const adminFetchSubscriptionById = createAsyncThunk(
  "subscriptions/adminFetchSubscriptionById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/admin/subscriptions/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch subscription details",
      );
    }
  },
);

export const adminCreateSubscription = createAsyncThunk(
  "subscriptions/adminCreateSubscription",
  async (subscriptionData, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/subscriptions", subscriptionData);
      toast.success("Subscription created successfully!");
      return data;
    } catch (err) {
      // Surface feature/role mismatch details if backend returned them
      toast.error(err.message || "Failed to create subscription");
      return rejectWithValue(err.message || "Failed to create subscription");
    }
  },
);

/**
 * Note: backend uses POST (not PUT) for update, per the existing
 * API convention. Sending `features` (even as []) replaces the
 * entire feature set; omit it to leave features untouched.
 */
export const adminUpdateSubscription = createAsyncThunk(
  "subscriptions/adminUpdateSubscription",
  async ({ id, subscriptionData }, { rejectWithValue }) => {
    try {
      const data = await api.post(
        `/admin/subscriptions/${id}`,
        subscriptionData,
      );
      toast.success("Subscription updated successfully!");
      return data;
    } catch (err) {
      toast.error(err.message || "Failed to update subscription");
      return rejectWithValue(err.message || "Failed to update subscription");
    }
  },
);

export const adminDeleteSubscription = createAsyncThunk(
  "subscriptions/adminDeleteSubscription",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/subscriptions/${id}`);
      toast.success("Subscription deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete subscription");
      return rejectWithValue(err.message || "Failed to delete subscription");
    }
  },
);


export const fetchMySubscription = createAsyncThunk(
  "subscription/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/subscription/me");
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load subscription");
    }
  },
);

/**
 * POST /api/subscription/change-plan
 * Body: { plan_id, payment_method_id? }
 *  - Upgrade  → payment_method_id REQUIRED, Stripe charges prorated amount
 *  - Downgrade → no payment_method_id; schedules at period end
 */
export const changePlan = createAsyncThunk(
  "subscription/changePlan",
  async ({ plan_id, payment_method_id }, { rejectWithValue }) => {
    try {
      const body = { plan_id };
      if (payment_method_id) body.payment_method_id = payment_method_id;
      const data = await api.post("/subscription/change-plan", body);
      toast.success(data?.message || "Plan changed successfully");
      return data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to change plan");
      return rejectWithValue(err.message || "Failed to change plan");
    }
  },
);

/**
 * POST /api/subscription/cancel-pending
 * Cancels a scheduled downgrade
 */
export const cancelPendingPlan = createAsyncThunk(
  "subscription/cancelPending",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.post("/subscription/cancel-pending");
      toast.success(data?.message || "Pending plan change cancelled");
      return data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to cancel pending change");
      return rejectWithValue(err.message || "Failed to cancel pending change");
    }
  },
);


export const purchaseMarketingAddon = createAsyncThunk(
  "subscription/marketingAddon",
  async ({ payment_method_id, months = 1 }, { rejectWithValue }) => {
    try {
      const data = await api.post("/subscription/marketing-addon", {
        payment_method_id,
        months,
      });
      toast.success(data?.message || "Marketing add-on activated");
      return data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to activate marketing add-on");
      return rejectWithValue(err.message || "Failed to activate marketing add-on");
    }
  },
);