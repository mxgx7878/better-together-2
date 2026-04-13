import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

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
