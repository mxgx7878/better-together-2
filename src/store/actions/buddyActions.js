import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ─── PARTICIPANT ───────────────────────────────────────────────
export const fetchMyBuddy = createAsyncThunk(
  "buddy/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/buddy/me");
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load buddy status");
    }
  },
);

// ─── ADMIN — Buddy profiles ────────────────────────────────────
export const adminFetchBuddies = createAsyncThunk(
  "buddy/adminFetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/buddies");
      return data?.data?.data || data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load buddies");
    }
  },
);

export const adminCreateBuddy = createAsyncThunk(
  "buddy/adminCreate",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/buddies", payload);
      toast.success("Buddy added");
      return data?.data?.data || data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to add buddy");
      return rejectWithValue(err.message || "Failed to add buddy");
    }
  },
);

export const adminUpdateBuddy = createAsyncThunk(
  "buddy/adminUpdate",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/buddies/${id}`, payload);
      toast.success("Buddy updated");
      return data?.data?.data || data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to update buddy");
      return rejectWithValue(err.message || "Failed to update buddy");
    }
  },
);

export const adminDeleteBuddy = createAsyncThunk(
  "buddy/adminDelete",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/buddies/${id}`);
      toast.success("Buddy deleted");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete buddy");
      return rejectWithValue(err.message || "Failed to delete buddy");
    }
  },
);

// ─── ADMIN — Assignment requests ───────────────────────────────
export const adminFetchBuddyAssignments = createAsyncThunk(
  "buddy/adminFetchAssignments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/buddy-assignments", { params });
      return data?.data || {};
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load assignments");
    }
  },
);

export const adminAssignBuddy = createAsyncThunk(
  "buddy/adminAssign",
  async ({ id, buddy_id, next_check_in }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/buddy-assignments/${id}/assign`, {
        buddy_id,
        next_check_in,
      });
      toast.success("Buddy assigned — participant notified");
      return data?.data?.data || data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to assign buddy");
      return rejectWithValue(err.message || "Failed to assign buddy");
    }
  },
);