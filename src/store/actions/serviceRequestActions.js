// ─── Service Request Actions ──────────────────────────────────────
// Participant posts "Looking for Services" → providers (paid) reply publicly.
// Participant can hire one provider → request marks as fulfilled.
// Admin can view / moderate / delete posts and replies.

import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// PUBLIC (authenticated) — list / view
// ═══════════════════════════════════════════════════════════════════

export const fetchServiceRequests = createAsyncThunk(
  "serviceRequests/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/service-requests", { params });
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load service requests");
    }
  },
);

export const fetchServiceRequest = createAsyncThunk(
  "serviceRequests/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/service-requests/${id}`);
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load service request");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// PARTICIPANT — create / close / select-provider / delete
// ═══════════════════════════════════════════════════════════════════

export const createServiceRequest = createAsyncThunk(
  "serviceRequests/create",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post("/service-requests", payload);
      toast.success(data?.message || "Your request has been posted");
      return data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to post request");
      return rejectWithValue(err.message || "Failed to post request");
    }
  },
);

export const closeServiceRequest = createAsyncThunk(
  "serviceRequests/close",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.patch(`/service-requests/${id}/close`);
      toast.success("Request closed");
      return data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to close request");
      return rejectWithValue(err.message || "Failed to close request");
    }
  },
);

/**
 * PATCH /api/service-requests/:id/select-provider
 * Body: { reply_id }
 * Hires a provider, marks request as fulfilled, sends notifications.
 */
export const selectServiceRequestProvider = createAsyncThunk(
  "serviceRequests/selectProvider",
  async ({ requestId, replyId }, { rejectWithValue }) => {
    try {
      const data = await api.patch(
        `/service-requests/${requestId}/select-provider`,
        { reply_id: replyId },
      );
      toast.success(data?.message || "Provider hired — request fulfilled");
      return data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to hire provider");
      return rejectWithValue(err.message || "Failed to hire provider");
    }
  },
);

export const deleteServiceRequest = createAsyncThunk(
  "serviceRequests/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/service-requests/${id}`);
      toast.success("Request deleted");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete request");
      return rejectWithValue(err.message || "Failed to delete request");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// PROVIDER — reply (paid only) / update (15-min) / delete
// ═══════════════════════════════════════════════════════════════════

export const createServiceRequestReply = createAsyncThunk(
  "serviceRequests/createReply",
  async ({ requestId, payload }, { rejectWithValue }) => {
    try {
      const data = await api.post(
        `/service-requests/${requestId}/replies`,
        payload,
      );
      toast.success(data?.message || "Reply posted");
      return { requestId, reply: data.data || data };
    } catch (err) {
      toast.error(err.message || "Failed to post reply");
      return rejectWithValue(err.message || "Failed to post reply");
    }
  },
);

/**
 * PUT /api/service-requests/:id/replies/:replyId
 * Provider can edit own reply within 15 minutes of posting.
 */
export const updateServiceRequestReply = createAsyncThunk(
  "serviceRequests/updateReply",
  async ({ requestId, replyId, payload }, { rejectWithValue }) => {
    try {
      const data = await api.put(
        `/service-requests/${requestId}/replies/${replyId}`,
        payload,
      );
      toast.success(data?.message || "Reply updated");
      return { requestId, reply: data.data || data };
    } catch (err) {
      toast.error(err.message || "Failed to update reply");
      return rejectWithValue(err.message || "Failed to update reply");
    }
  },
);

export const deleteServiceRequestReply = createAsyncThunk(
  "serviceRequests/deleteReply",
  async ({ requestId, replyId }, { rejectWithValue }) => {
    try {
      await api.del(`/service-requests/${requestId}/replies/${replyId}`);
      toast.success("Reply removed");
      return { requestId, replyId };
    } catch (err) {
      toast.error(err.message || "Failed to remove reply");
      return rejectWithValue(err.message || "Failed to remove reply");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — moderation + analytics
// ═══════════════════════════════════════════════════════════════════

export const adminFetchServiceRequestStats = createAsyncThunk(
  "serviceRequests/adminFetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/service-requests/stats");
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load analytics");
    }
  },
);

export const adminFetchServiceRequests = createAsyncThunk(
  "serviceRequests/adminFetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/service-requests", { params });
      return data.data || data;
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to load service requests",
      );
    }
  },
);

export const adminDeleteServiceRequest = createAsyncThunk(
  "serviceRequests/adminDelete",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/service-requests/${id}`);
      toast.success("Service request deleted");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete request");
      return rejectWithValue(err.message || "Failed to delete request");
    }
  },
);

export const adminDeleteServiceRequestReply = createAsyncThunk(
  "serviceRequests/adminDeleteReply",
  async ({ requestId, replyId }, { rejectWithValue }) => {
    try {
      await api.del(
        `/admin/service-requests/${requestId}/replies/${replyId}`,
      );
      toast.success("Reply deleted");
      return { requestId, replyId };
    } catch (err) {
      toast.error(err.message || "Failed to delete reply");
      return rejectWithValue(err.message || "Failed to delete reply");
    }
  },
);