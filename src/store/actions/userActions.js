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
