import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// ADMIN DOCUMENT APIs
// ═══════════════════════════════════════════════════════════════════

export const adminFetchDocuments = createAsyncThunk(
  "documents/adminFetchDocuments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/documents", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch documents");
    }
  },
);

export const adminFetchDocumentById = createAsyncThunk(
  "documents/adminFetchDocumentById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/admin/documents/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch document");
    }
  },
);

export const adminCreateDocument = createAsyncThunk(
  "documents/adminCreateDocument",
  async (documentData, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/documents", documentData);
      toast.success("Document uploaded successfully!");
      return data;
    } catch (err) {
      toast.error(err.message || "Failed to upload document");
      return rejectWithValue(err.message || "Failed to upload document");
    }
  },
);

export const adminUpdateDocument = createAsyncThunk(
  "documents/adminUpdateDocument",
  async ({ id, documentData }, { rejectWithValue }) => {
    try {
      // Laravel multipart update: POST with _method=PUT
      if (documentData instanceof FormData && !documentData.has("_method")) {
        documentData.append("_method", "PUT");
      }
      const data = await api.post(`/admin/documents/${id}`, documentData);
      toast.success("Document updated successfully!");
      return data;
    } catch (err) {
      toast.error(err.message || "Failed to update document");
      return rejectWithValue(err.message || "Failed to update document");
    }
  },
);

export const adminDeleteDocument = createAsyncThunk(
  "documents/adminDeleteDocument",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/documents/${id}`);
      toast.success("Document deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete document");
      return rejectWithValue(err.message || "Failed to delete document");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// PUBLIC (Provider / Participant) DOCUMENT APIs — read-only
// ═══════════════════════════════════════════════════════════════════

export const fetchDocuments = createAsyncThunk(
  "documents/fetchDocuments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/documents", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch documents");
    }
  },
);


export const fetchSafetyDocuments = createAsyncThunk(
  "safetyNumbers/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/safety-documents");
      return data?.data?.data || data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load safety documents");
    }
  },
);

// ADMIN — CRUD
export const adminFetchSafetyDocuments = createAsyncThunk(
  "safetyNumbers/adminFetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/safety-documents");
      return data?.data?.data || data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load safety documents");
    }
  },
);

export const adminCreateSafetyDocument = createAsyncThunk(
  "safetyNumbers/adminCreateDocument",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/safety-documents", formData);
      toast.success("Document added");
      return data?.data?.data || data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to add document");
      return rejectWithValue(err.message || "Failed to add document");
    }
  },
);

export const adminUpdateSafetyDocument = createAsyncThunk(
  "safetyNumbers/adminUpdateDocument",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      // POST (not PUT) — multipart update per project convention
      const data = await api.post(`/admin/safety-documents/${id}`, formData);
      toast.success("Document updated");
      return data?.data?.data || data?.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to update document");
      return rejectWithValue(err.message || "Failed to update document");
    }
  },
);

export const adminDeleteSafetyDocument = createAsyncThunk(
  "safetyNumbers/adminDeleteDocument",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/safety-documents/${id}`);
      toast.success("Document deleted");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete document");
      return rejectWithValue(err.message || "Failed to delete document");
    }
  },
);