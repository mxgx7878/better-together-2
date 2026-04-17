// ─── Service Request Actions ──────────────────────────────────────
// Participant posts "Looking for Services" → providers (paid) reply publicly.
// Admin can view / moderate / delete posts and replies.

import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// PUBLIC (authenticated) — list / view
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/service-requests
 * Query params: { page, search, service_type, location }
 * Returns paginated list of open service requests (everyone can read).
 */
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

/**
 * GET /api/service-requests/:id
 * Returns a single request with its replies array.
 */
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
// PARTICIPANT — create / close / delete own post
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /api/service-requests
 * Body: { service_type, location, needed_from, summary, category_id? }
 */
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

/**
 * PATCH /api/service-requests/:id/close
 * Close own request (no more replies accepted).
 */
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
 * DELETE /api/service-requests/:id
 * Author can delete own request.
 */
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
// PROVIDER — reply (paid only, enforced server-side too)
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /api/service-requests/:id/replies
 * Body: { message, contact_email, contact_phone }
 * Only paid providers can reply; replies are public.
 */
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
 * DELETE /api/service-requests/:id/replies/:replyId
 * Reply author can delete own reply.
 */
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
// ADMIN — moderation
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/service-requests
 * Query params: { page, search, status, user_id }
 */
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

/**
 * DELETE /api/admin/service-requests/:id
 * Admin hard-deletes a post (and its replies).
 */
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

/**
 * DELETE /api/admin/service-requests/:id/replies/:replyId
 * Admin removes an individual reply.
 */
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
