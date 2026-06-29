import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchSafetyNumbers,
  adminFetchSafetyNumbers,
  adminCreateSafetyNumber,
  adminUpdateSafetyNumber,
  adminDeleteSafetyNumber,
} from "../actions/safetyNumberActions";

const safetyNumberSlice = createSlice({
  name: "safetyNumber",
  initialState: {
    items: [],
    status: ASYNC_STATUS.IDLE,
    saveStatus: ASYNC_STATUS.IDLE,
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
  },
});

export default safetyNumberSlice.reducer;