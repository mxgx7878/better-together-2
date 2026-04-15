import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  adminFetchDocuments,
  adminFetchDocumentById,
  adminCreateDocument,
  adminUpdateDocument,
  adminDeleteDocument,
  fetchDocuments,
} from "../actions/documentActions";

const extractList = (payload) => {
  if (!payload) return [];
  const data = payload.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.documents)) return data.documents;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const extractItem = (payload) => {
  if (!payload) return null;
  const data = payload.data ?? payload;
  return data?.document ?? data;
};

const documentSlice = createSlice({
  name: "document",
  initialState: {
    documents: [],
    publicDocuments: [],
    selectedDocument: null,
    status: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {
    clearSelectedDocument(state) {
      state.selectedDocument = null;
    },
  },
  extraReducers: (builder) => {
    // ─── Admin Fetch All ────────────────────────────────────────
    builder.addCase(adminFetchDocuments.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminFetchDocuments.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.documents = extractList(payload);
    });
    builder.addCase(adminFetchDocuments.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Fetch Single ─────────────────────────────────────
    builder.addCase(adminFetchDocumentById.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminFetchDocumentById.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.selectedDocument = extractItem(payload);
    });
    builder.addCase(adminFetchDocumentById.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Create ───────────────────────────────────────────
    builder.addCase(adminCreateDocument.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminCreateDocument.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      const newDoc = extractItem(payload);
      if (newDoc) state.documents.unshift(newDoc);
    });
    builder.addCase(adminCreateDocument.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Update ───────────────────────────────────────────
    builder.addCase(adminUpdateDocument.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminUpdateDocument.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      const updated = extractItem(payload);
      if (updated) {
        const idx = state.documents.findIndex((d) => d.id === updated.id);
        if (idx !== -1) state.documents[idx] = updated;
      }
    });
    builder.addCase(adminUpdateDocument.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Delete ───────────────────────────────────────────
    builder.addCase(adminDeleteDocument.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminDeleteDocument.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.documents = state.documents.filter((d) => d.id !== payload);
    });
    builder.addCase(adminDeleteDocument.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Public (Provider / Participant) Fetch ──────────────────
    builder.addCase(fetchDocuments.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(fetchDocuments.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.publicDocuments = extractList(payload);
    });
    builder.addCase(fetchDocuments.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });
  },
});

export const { clearSelectedDocument } = documentSlice.actions;

export default documentSlice.reducer;
