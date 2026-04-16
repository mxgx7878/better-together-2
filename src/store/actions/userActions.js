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
      // Returns Laravel paginator: { current_page, data: [...users], total, last_page, ... }
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
      // Returns user object (unwrapped from { status, message, data })
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch user");
    }
  },
);

export const adminToggleUserStatus = createAsyncThunk(
  "admin/toggleUserStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/users/${userId}/toggle-status`);
      toast.success(data?.message || "User status updated successfully");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to update user status");
      return rejectWithValue(err.message || "Failed to update user status");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — Approve / Reject / Suspend / Activate user
// ═══════════════════════════════════════════════════════════════════

/**
 * POST /api/admin/users/:id/approve
 * Approve a pending user profile
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
 * Reject a pending user profile
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
 * Suspend an active user
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
 * POST /api/admin/users/:id/deactivate
 * Body: { reason?: string }
 * Temporarily deactivate an active user (can be re-activated later)
 */
export const adminDeactivateUser = createAsyncThunk(
  "admin/deactivateUser",
  async ({ userId, reason }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/users/${userId}/deactivate`, { reason });
      toast.success(data?.message || "User deactivated");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to deactivate user");
      return rejectWithValue(err.message || "Failed to deactivate user");
    }
  },
);

/**
 * POST /api/admin/users/:id/activate
 * Re-activate a deactivated / suspended / rejected user
 */
export const adminActivateUser = createAsyncThunk(
  "admin/activateUser",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/users/${userId}/activate`);
      toast.success(data?.message || "User activated successfully");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to activate user");
      return rejectWithValue(err.message || "Failed to activate user");
    }
  },
);
