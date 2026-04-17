import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// ADMIN USER APIs
// ═══════════════════════════════════════════════════════════════════

export const adminFetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/users", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch users");
    }
  },
);

export const adminFetchUser = createAsyncThunk(
  "admin/fetchUser",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await api.get(`/admin/users/${userId}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch user");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — Status management (4 statuses: pending, approved, rejected, suspended)
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /api/admin/users/:id/approve
 * Approve a pending user → status becomes "approved"
 */
export const adminApproveUser = createAsyncThunk(
  "admin/approveUser",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/users/${userId}/approve`);
      toast.success(data?.message || "User approved successfully");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to approve user");
      return rejectWithValue(err.message || "Failed to approve user");
    }
  },
);

/**
 * POST /api/admin/users/:id/reject
 * Body: { reason?: string }
 * Reject a pending user → status becomes "rejected"
 */
export const adminRejectUser = createAsyncThunk(
  "admin/rejectUser",
  async ({ userId, reason }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/users/${userId}/reject`, { reason });
      toast.success(data?.message || "User rejected");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to reject user");
      return rejectWithValue(err.message || "Failed to reject user");
    }
  },
);

/**
 * POST /api/admin/users/:id/suspend
 * Body: { reason?: string }
 * Suspend an approved user → status becomes "suspended"
 */
export const adminSuspendUser = createAsyncThunk(
  "admin/suspendUser",
  async ({ userId, reason }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/users/${userId}/suspend`, { reason });
      toast.success(data?.message || "User suspended");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to suspend user");
      return rejectWithValue(err.message || "Failed to suspend user");
    }
  },
);

/**
 * POST /api/admin/users/:id/pending
 * Set user back to pending (from rejected/suspended → re-review)
 */
export const adminSetPendingUser = createAsyncThunk(
  "admin/setPendingUser",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/users/${userId}/pending`);
      toast.success(data?.message || "User set to pending");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to update user status");
      return rejectWithValue(err.message || "Failed to update user status");
    }
  },
);
