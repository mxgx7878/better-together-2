import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// PUBLIC — Fetch active ribbon entries (used on dashboards + directory)
// ═══════════════════════════════════════════════════════════════════
export const fetchMarketingRibbon = createAsyncThunk(
  "marketingRibbon/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/marketing-ribbon");
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load ribbon");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — CRUD
// ═══════════════════════════════════════════════════════════════════
export const adminFetchMarketingRibbon = createAsyncThunk(
  "marketingRibbon/adminFetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/marketing-ribbon");
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load ribbon");
    }
  },
);

export const adminCreateRibbonEntry = createAsyncThunk(
  "marketingRibbon/adminCreate",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/marketing-ribbon", payload);
      toast.success("Ribbon entry added");
      return data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to add ribbon entry");
      return rejectWithValue(err.message || "Failed to add ribbon entry");
    }
  },
);

export const adminUpdateRibbonEntry = createAsyncThunk(
  "marketingRibbon/adminUpdate",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/marketing-ribbon/${id}`, payload);
      toast.success("Ribbon entry updated");
      return data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to update ribbon entry");
      return rejectWithValue(err.message || "Failed to update ribbon entry");
    }
  },
);

export const adminDeleteRibbonEntry = createAsyncThunk(
  "marketingRibbon/adminDelete",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/marketing-ribbon/${id}`);
      toast.success("Ribbon entry deleted");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete ribbon entry");
      return rejectWithValue(err.message || "Failed to delete ribbon entry");
    }
  },
);

export const adminReorderRibbonEntry = createAsyncThunk(
  "marketingRibbon/adminReorder",
  async ({ id, direction }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/marketing-ribbon/${id}/reorder`, {
        direction, // "up" or "down"
      });
      return data?.data || [];
    } catch (err) {
      toast.error(err.message || "Failed to reorder");
      return rejectWithValue(err.message || "Failed to reorder");
    }
  },
);