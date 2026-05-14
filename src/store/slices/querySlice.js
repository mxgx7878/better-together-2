import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  submitQuery,
  fetchMyQueries,
  adminFetchQueries,
  adminFetchQueryStats,
  adminRespondToQuery,
  adminUpdateQueryStatus,
  adminDeleteQuery,
} from "../actions/queryActions";

const initialState = {
  // User-side
  myQueries: [],
  myQueriesStatus: ASYNC_STATUS.IDLE,
  submitStatus: ASYNC_STATUS.IDLE,

  // Admin-side
  list: [],
  total: 0,
  status: ASYNC_STATUS.IDLE,
  stats: null,
  statsStatus: ASYNC_STATUS.IDLE,
  responseStatus: ASYNC_STATUS.IDLE,

  error: null,
};

const patchInLists = (state, updated) => {
  if (!updated?.id) return;
  const idx = state.list.findIndex((q) => q.id === updated.id);
  if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };

  const myIdx = state.myQueries.findIndex((q) => q.id === updated.id);
  if (myIdx !== -1)
    state.myQueries[myIdx] = { ...state.myQueries[myIdx], ...updated };
};

const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    clearSubmitStatus(state) {
      state.submitStatus = ASYNC_STATUS.IDLE;
      state.responseStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    // ─── Submit ─────────────────────────────────────────────
    builder
      .addCase(submitQuery.pending, (s) => {
        s.submitStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(submitQuery.fulfilled, (s, { payload }) => {
        s.submitStatus = ASYNC_STATUS.SUCCEEDED;
        if (payload?.id) s.myQueries.unshift(payload);
      })
      .addCase(submitQuery.rejected, (s, { payload }) => {
        s.submitStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── My Queries ─────────────────────────────────────────
    builder
      .addCase(fetchMyQueries.pending, (s) => {
        s.myQueriesStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchMyQueries.fulfilled, (s, { payload }) => {
        s.myQueriesStatus = ASYNC_STATUS.SUCCEEDED;
        s.myQueries = Array.isArray(payload) ? payload : payload?.data || [];
      })
      .addCase(fetchMyQueries.rejected, (s, { payload }) => {
        s.myQueriesStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Admin List ─────────────────────────────────────────
    builder
      .addCase(adminFetchQueries.pending, (s) => {
        s.status = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchQueries.fulfilled, (s, { payload }) => {
        s.status = ASYNC_STATUS.SUCCEEDED;
        s.list = payload?.data || payload || [];
        s.total = payload?.total || s.list.length;
      })
      .addCase(adminFetchQueries.rejected, (s, { payload }) => {
        s.status = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Admin Stats ────────────────────────────────────────
    builder
      .addCase(adminFetchQueryStats.pending, (s) => {
        s.statsStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchQueryStats.fulfilled, (s, { payload }) => {
        s.statsStatus = ASYNC_STATUS.SUCCEEDED;
        s.stats = payload;
      })
      .addCase(adminFetchQueryStats.rejected, (s, { payload }) => {
        s.statsStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Admin Respond ──────────────────────────────────────
    builder
      .addCase(adminRespondToQuery.pending, (s) => {
        s.responseStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminRespondToQuery.fulfilled, (s, { payload }) => {
        s.responseStatus = ASYNC_STATUS.SUCCEEDED;
        patchInLists(s, payload);
      })
      .addCase(adminRespondToQuery.rejected, (s, { payload }) => {
        s.responseStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Admin Update Status ────────────────────────────────
    builder.addCase(adminUpdateQueryStatus.fulfilled, (s, { payload }) => {
      patchInLists(s, payload);
    });

    // ─── Admin Delete ───────────────────────────────────────
    builder.addCase(adminDeleteQuery.fulfilled, (s, { payload: id }) => {
      s.list = s.list.filter((q) => q.id !== id);
      s.total = Math.max(0, s.total - 1);
    });
  },
});

export const { clearSubmitStatus } = querySlice.actions;
export default querySlice.reducer;