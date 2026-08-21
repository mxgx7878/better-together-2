import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// PUBLIC — Innovation Lab (provider page)
// ═══════════════════════════════════════════════════════════════════

export const fetchInnovationLabResources = createAsyncThunk(
  "innovationLab/fetchResources",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/innovation-lab/resources", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch resources");
    }
  },
);

export const fetchInnovationLabResourceById = createAsyncThunk(
  "innovationLab/fetchResourceById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/innovation-lab/resources/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch resource");
    }
  },
);

export const fetchInnovationLabCategories = createAsyncThunk(
  "innovationLab/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/innovation-lab/categories");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch categories");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — Innovation Lab Resources
// ═══════════════════════════════════════════════════════════════════

export const adminFetchInnovationLabResources = createAsyncThunk(
  "innovationLab/adminFetchResources",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/innovation-lab/resources", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch resources");
    }
  },
);

export const adminFetchInnovationLabResourceById = createAsyncThunk(
  "innovationLab/adminFetchResourceById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/admin/innovation-lab/resources/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch resource");
    }
  },
);

export const adminCreateInnovationLabResource = createAsyncThunk(
  "innovationLab/adminCreateResource",
  async (resourceData, { rejectWithValue }) => {
    try {
      const data = await api.post(
        "/admin/innovation-lab/resources",
        resourceData,
      );
      toast.success("Resource created successfully!");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to create resource");
      return rejectWithValue(err.message || "Failed to create resource");
    }
  },
);

export const adminUpdateInnovationLabResource = createAsyncThunk(
  "innovationLab/adminUpdateResource",
  async ({ id, resourceData }, { rejectWithValue }) => {
    try {
      const data = await api.put(
        `/admin/innovation-lab/resources/${id}`,
        resourceData,
      );
      toast.success("Resource updated successfully!");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to update resource");
      return rejectWithValue(err.message || "Failed to update resource");
    }
  },
);

export const adminDeleteInnovationLabResource = createAsyncThunk(
  "innovationLab/adminDeleteResource",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/innovation-lab/resources/${id}`);
      toast.success("Resource deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete resource");
      return rejectWithValue(err.message || "Failed to delete resource");
    }
  },
);