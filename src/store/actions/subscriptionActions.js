import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// PUBLIC SUBSCRIPTION API
// ═══════════════════════════════════════════════════════════════════

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
      toast.error(err.message || "Failed to create subscription");
      return rejectWithValue(err.message || "Failed to create subscription");
    }
  },
);

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

/**
 * DELETE /api/admin/subscriptions/{id}[?migrate_to_plan_id=N]
 *
 * Signature change: now accepts either a plain id, OR an object
 *   { id, migrate_to_plan_id? }.
 * Backwards-compatible: existing callers passing just an integer still work.
 *
 * If the plan has dependencies (active subscribers, pending changes, or
 * historical invoices) AND no migrate_to_plan_id was provided, the API
 * returns 409 with { requires_migration: true, active_subscribers, ... }.
 * The UI should then re-open the modal and ask which plan to migrate to.
 */
export const adminDeleteSubscription = createAsyncThunk(
  "subscriptions/adminDeleteSubscription",
  async (arg, { rejectWithValue }) => {
    // Normalise argument shape
    const id = typeof arg === "object" && arg !== null ? arg.id : arg;
    const migrateToPlanId =
      typeof arg === "object" && arg !== null ? arg.migrate_to_plan_id : null;

    if (!id) {
      return rejectWithValue("Subscription id is required");
    }

    // Build URL with optional query param (more reliable than DELETE body
    // across different HTTP client configurations).
    const url = migrateToPlanId
      ? `/admin/subscriptions/${id}?migrate_to_plan_id=${migrateToPlanId}`
      : `/admin/subscriptions/${id}`;

    try {
      const data = await api.del(url);
      toast.success(data?.message || "Subscription deleted successfully!");
      return { id, response: data };
    } catch (err) {
      // Surface migration-required state without toasting an error —
      // the UI handles the next step (showing the migration dropdown).
      if (err?.requires_migration || /requires_migration/i.test(err?.message || "")) {
        return rejectWithValue({
          requires_migration: true,
          active_subscribers: err.active_subscribers,
          pending_subscribers: err.pending_subscribers,
          invoice_count: err.invoice_count,
          message: err.message,
        });
      }
      toast.error(err.message || "Failed to delete subscription");
      return rejectWithValue(err.message || "Failed to delete subscription");
    }
  },
);

/**
 * GET /api/admin/subscriptions/{id}/subscribers
 * Lists all users currently OR pending-changed onto a specific plan.
 * Used by the admin Manage Subscriptions page → "View Subscribers" action.
 */
export const adminFetchPlanSubscribers = createAsyncThunk(
  "subscriptions/adminFetchPlanSubscribers",
  async ({ planId, params = {} } = {}, { rejectWithValue }) => {
    try {
      const data = await api.get(`/admin/subscriptions/${planId}/subscribers`, {
        params,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to load plan subscribers",
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// USER SUBSCRIPTION APIs (current logged-in user)
// ═══════════════════════════════════════════════════════════════════

export const fetchMySubscription = createAsyncThunk(
  "subscription/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/subscription/me");
      return data?.data || data;
    } catch (err) {
      if (/no subscription/i.test(err.message || "")) return null;
      return rejectWithValue(err.message || "Failed to load subscription");
    }
  },
);

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

export const cancelSubscription = createAsyncThunk(
  "subscription/cancel",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.post("/subscription/cancel");
      toast.success(data?.message || "Subscription cancelled");
      return data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to cancel subscription");
      return rejectWithValue(err.message || "Failed to cancel subscription");
    }
  },
);

export const resumeSubscription = createAsyncThunk(
  "subscription/resume",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.post("/subscription/resume");
      toast.success(data?.message || "Subscription resumed");
      return data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to resume subscription");
      return rejectWithValue(err.message || "Failed to resume subscription");
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