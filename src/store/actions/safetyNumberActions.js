// ─── Safety Numbers Actions ───────────────────────────────────────
// Admin-managed "Important Contacts" shown on the Rights & Safety page.

import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// PUBLIC (authenticated) — read
// ═══════════════════════════════════════════════════════════════════
export const fetchSafetyNumbers = createAsyncThunk(
  "safetyNumbers/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/safety-numbers");
      return data?.data?.data || data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load safety numbers");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — CRUD
// ═══════════════════════════════════════════════════════════════════
export const adminFetchSafetyNumbers = createAsyncThunk(
  "safetyNumbers/adminFetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/safety-numbers");
      return data?.data?.data || data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load safety numbers");
    }
  },
);

export const adminCreateSafetyNumber = createAsyncThunk(
  "safetyNumbers/adminCreate",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/safety-numbers", payload);
      toast.success("Safety number added");
      return data?.data?.data || data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to add safety number");
      return rejectWithValue(err.message || "Failed to add safety number");
    }
  },
);

export const adminUpdateSafetyNumber = createAsyncThunk(
  "safetyNumbers/adminUpdate",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await api.patch(`/admin/safety-numbers/${id}`, payload);
      toast.success("Safety number updated");
      return data?.data?.data || data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to update safety number");
      return rejectWithValue(err.message || "Failed to update safety number");
    }
  },
);

export const adminDeleteSafetyNumber = createAsyncThunk(
  "safetyNumbers/adminDelete",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/safety-numbers/${id}`);
      toast.success("Safety number deleted");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete safety number");
      return rejectWithValue(err.message || "Failed to delete safety number");
    }
  },
);