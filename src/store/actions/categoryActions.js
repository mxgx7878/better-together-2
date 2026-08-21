import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// ADMIN CATEGORY APIs
// ═══════════════════════════════════════════════════════════════════

export const adminFetchCategories = createAsyncThunk(
  "categories/adminFetchCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/categories", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch categories");
    }
  },
);

export const adminFetchCategoryById = createAsyncThunk(
  "categories/adminFetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/admin/categories/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch category details");
    }
  },
);

export const adminCreateCategory = createAsyncThunk(
  "categories/adminCreateCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/categories", categoryData);
      toast.success("Category created successfully!");
      return data;
    } catch (err) {
      toast.error(err.message || "Failed to create category");
      return rejectWithValue(err.message || "Failed to create category");
    }
  },
);

export const adminUpdateCategory = createAsyncThunk(
  "categories/adminUpdateCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/categories/${id}`, categoryData);
      toast.success("Category updated successfully!");
      return data;
    } catch (err) {
      toast.error(err.message || "Failed to update category");
      return rejectWithValue(err.message || "Failed to update category");
    }
  },
);

export const adminDeleteCategory = createAsyncThunk(
  "categories/adminDeleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/categories/${id}`);
      toast.success("Category deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
      return rejectWithValue(err.message || "Failed to delete category");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// PUBLIC CATEGORY APIs
// ═══════════════════════════════════════════════════════════════════

export const fetchPublicCategories = createAsyncThunk(
  "categories/fetchPublicCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/provider/categories");
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch categories");
    }
  },
);
