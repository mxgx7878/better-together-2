import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchSafetyNumbers,
  adminFetchSafetyNumbers,
  adminCreateSafetyNumber,
  adminUpdateSafetyNumber,
  adminDeleteSafetyNumber,

   fetchSafetyDocuments,
  adminFetchSafetyDocuments,
  adminCreateSafetyDocument,
  adminUpdateSafetyDocument,
  adminDeleteSafetyDocument,
} from "../actions/safetyNumberActions";

const safetyNumberSlice = createSlice({
  name: "safetyNumber",
  initialState: {
    items: [],
    status: ASYNC_STATUS.IDLE,
    saveStatus: ASYNC_STATUS.IDLE,
    documents: [],
    docStatus: ASYNC_STATUS.IDLE,
    docSaveStatus: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // ─── Public + admin fetch share the same list state ─────
    const onFetchPending = (s) => {
      s.status = ASYNC_STATUS.LOADING;
    };
    const onFetchFulfilled = (s, { payload }) => {
      s.status = ASYNC_STATUS.SUCCEEDED;
      s.items = payload || [];
    };
    const onFetchRejected = (s, { payload }) => {
      s.status = ASYNC_STATUS.FAILED;
      s.error = payload;
    };

    builder
      .addCase(fetchSafetyNumbers.pending, onFetchPending)
      .addCase(fetchSafetyNumbers.fulfilled, onFetchFulfilled)
      .addCase(fetchSafetyNumbers.rejected, onFetchRejected)
      .addCase(adminFetchSafetyNumbers.pending, onFetchPending)
      .addCase(adminFetchSafetyNumbers.fulfilled, onFetchFulfilled)
      .addCase(adminFetchSafetyNumbers.rejected, onFetchRejected);

    // ─── Create ─────────────────────────────────────────────
    builder
      .addCase(adminCreateSafetyNumber.pending, (s) => {
        s.saveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminCreateSafetyNumber.fulfilled, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.SUCCEEDED;
        if (payload?.id) s.items.push(payload);
      })
      .addCase(adminCreateSafetyNumber.rejected, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Update ─────────────────────────────────────────────
    builder
      .addCase(adminUpdateSafetyNumber.pending, (s) => {
        s.saveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminUpdateSafetyNumber.fulfilled, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.SUCCEEDED;
        if (payload?.id) {
          const idx = s.items.findIndex((n) => n.id === payload.id);
          if (idx !== -1) s.items[idx] = payload;
        }
      })
      .addCase(adminUpdateSafetyNumber.rejected, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Delete ─────────────────────────────────────────────
    builder.addCase(adminDeleteSafetyNumber.fulfilled, (s, { payload: id }) => {
      s.items = s.items.filter((n) => n.id !== id);
    });

    // ─── Documents: fetch ──────────────────────────────────

     const onDocPending = (s) => {
      s.docStatus = ASYNC_STATUS.LOADING;
    };
    const onDocFulfilled = (s, { payload }) => {
      s.docStatus = ASYNC_STATUS.SUCCEEDED;
      s.documents = payload || [];
    };
    const onDocRejected = (s, { payload }) => {
      s.docStatus = ASYNC_STATUS.FAILED;
      s.error = payload;
    };

    builder
      .addCase(fetchSafetyDocuments.pending, onDocPending)
      .addCase(fetchSafetyDocuments.fulfilled, onDocFulfilled)
      .addCase(fetchSafetyDocuments.rejected, onDocRejected)
      .addCase(adminFetchSafetyDocuments.pending, onDocPending)
      .addCase(adminFetchSafetyDocuments.fulfilled, onDocFulfilled)
      .addCase(adminFetchSafetyDocuments.rejected, onDocRejected);

    // ─── Documents: create ──────────────────────────────────
    builder
      .addCase(adminCreateSafetyDocument.pending, (s) => {
        s.docSaveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminCreateSafetyDocument.fulfilled, (s, { payload }) => {
        s.docSaveStatus = ASYNC_STATUS.SUCCEEDED;
        if (payload?.id) s.documents.unshift(payload);
      })
      .addCase(adminCreateSafetyDocument.rejected, (s, { payload }) => {
        s.docSaveStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Documents: update ──────────────────────────────────
    builder
      .addCase(adminUpdateSafetyDocument.pending, (s) => {
        s.docSaveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminUpdateSafetyDocument.fulfilled, (s, { payload }) => {
        s.docSaveStatus = ASYNC_STATUS.SUCCEEDED;
        if (payload?.id) {
          const idx = s.documents.findIndex((d) => d.id === payload.id);
          if (idx !== -1) s.documents[idx] = payload;
        }
      })
      .addCase(adminUpdateSafetyDocument.rejected, (s, { payload }) => {
        s.docSaveStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Documents: delete ──────────────────────────────────
    builder.addCase(adminDeleteSafetyDocument.fulfilled, (s, { payload: id }) => {
      s.documents = s.documents.filter((d) => d.id !== id);
    });
  },
});

export default safetyNumberSlice.reducer;