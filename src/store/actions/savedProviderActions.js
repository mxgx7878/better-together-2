import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

export const fetchSavedProviders = createAsyncThunk(
  "savedProviders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/saved-providers");
      return data.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load saved providers");
    }
  },
);

export const saveProvider = createAsyncThunk(
  "savedProviders/save",
  async (providerId, { rejectWithValue }) => {
    try {
      const data = await api.post("/saved-providers", {
        provider_id: providerId,
      });
      toast.success(data?.message || "Provider saved");
      return { providerId: Number(providerId) };
    } catch (err) {
      toast.error(err.message || "Failed to save provider");
      return rejectWithValue(err.message || "Failed to save provider");
    }
  },
);

export const unsaveProvider = createAsyncThunk(
  "savedProviders/unsave",
  async (providerId, { rejectWithValue }) => {
    try {
      const data = await api.del(`/saved-providers/${providerId}`);
      toast.success(data?.message || "Removed from saved");
      return { providerId: Number(providerId) };
    } catch (err) {
      toast.error(err.message || "Failed to remove provider");
      return rejectWithValue(err.message || "Failed to remove provider");
    }
  },
);