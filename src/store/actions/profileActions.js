import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// SELF — Profile (participant / provider updates their own profile)
// ═══════════════════════════════════════════════════════════════════

export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/user/profile");
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch profile");
    }
  },
);

export const updateMyProfile = createAsyncThunk(
  "profile/updateMyProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post("/user/profile", payload);
      toast.success(data?.message || "Profile updated successfully");
      // Also update localStorage so authSlice stays in sync
      if (data?.data) {
        localStorage.setItem("bt_user", JSON.stringify(data.data));
      }
      return data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
      return rejectWithValue(err.message || "Failed to update profile");
    }
  },
);

export const uploadAvatar = createAsyncThunk(
  "profile/uploadAvatar",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const data = await api.post("/user/profile/avatar", formData);
      toast.success("Avatar updated successfully");
      return data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to upload avatar");
      return rejectWithValue(err.message || "Failed to upload avatar");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — Create / Update any user
// ═══════════════════════════════════════════════════════════════════

export const adminCreateUser = createAsyncThunk(
  "profile/adminCreateUser",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/users", payload);
      toast.success(data?.message || "User created successfully");
      return data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to create user");
      return rejectWithValue(err.message || "Failed to create user");
    }
  },
);

export const adminUpdateUser = createAsyncThunk(
  "profile/adminUpdateUser",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await api.put(`/admin/users/${id}`, payload);
      toast.success(data?.message || "User updated successfully");
      return data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to update user");
      return rejectWithValue(err.message || "Failed to update user");
    }
  },
);
