// ─── Query / Support Ticket Actions ──────────────────────────────
// Participants & providers submit queries → admin responds → response
// shown back on their AdminSupportPage. Single response per query for now.

import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// USER (participant / provider) — submit + view own queries
// ═══════════════════════════════════════════════════════════════════

export const submitQuery = createAsyncThunk(
  "queries/submit",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post("/queries", payload);
      toast.success(data?.message || "Your query has been sent to admin");
      return data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to send query");
      return rejectWithValue(err.message || "Failed to send query");
    }
  },
);

export const fetchMyQueries = createAsyncThunk(
  "queries/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/queries/my");
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load your queries");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════════

export const adminFetchQueries = createAsyncThunk(
  "queries/adminFetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/queries", { params });
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load queries");
    }
  },
);

export const adminFetchQueryStats = createAsyncThunk(
  "queries/adminFetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/queries/stats");
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load stats");
    }
  },
);

export const adminRespondToQuery = createAsyncThunk(
  "queries/adminRespond",
  async ({ id, response }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/queries/${id}/respond`, {
        response,
      });
      toast.success(data?.message || "Response sent");
      return data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to send response");
      return rejectWithValue(err.message || "Failed to send response");
    }
  },
);

export const adminUpdateQueryStatus = createAsyncThunk(
  "queries/adminUpdateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await api.patch(`/admin/queries/${id}/status`, { status });
      toast.success("Status updated");
      return data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to update status");
      return rejectWithValue(err.message || "Failed to update status");
    }
  },
);

export const adminDeleteQuery = createAsyncThunk(
  "queries/adminDelete",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/queries/${id}`);
      toast.success("Query deleted");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete query");
      return rejectWithValue(err.message || "Failed to delete query");
    }
  },
);