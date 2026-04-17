import { createSlice } from "@reduxjs/toolkit";
import {
  fetchServiceRequests,
  fetchServiceRequest,
  createServiceRequest,
  closeServiceRequest,
  deleteServiceRequest,
  createServiceRequestReply,
  deleteServiceRequestReply,
  adminFetchServiceRequests,
  adminFetchServiceRequestStats,
  adminDeleteServiceRequest,
  adminDeleteServiceRequestReply,
} from "../actions/serviceRequestActions";
import { ASYNC_STATUS } from "../../constants";

const initialState = {
  list: [],
  total: 0,
  totalPages: 0,
  page: 1,
  status: ASYNC_STATUS.IDLE,
  selected: null,
  selectedStatus: ASYNC_STATUS.IDLE,
  saveStatus: ASYNC_STATUS.IDLE,
  replyStatus: ASYNC_STATUS.IDLE,
  stats: null,
  statsStatus: ASYNC_STATUS.IDLE,
  error: null,
};

const patchInList = (state, updated) => {
  if (!updated) return;
  const idx = state.list.findIndex((r) => r.id === updated.id);
  if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
  if (state.selected?.id === updated.id) {
    state.selected = { ...state.selected, ...updated };
  }
};

const serviceRequestSlice = createSlice({
  name: "serviceRequest",
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
      state.selectedStatus = ASYNC_STATUS.IDLE;
    },
    clearSaveStatus(state) {
      state.saveStatus = ASYNC_STATUS.IDLE;
      state.replyStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    // ─── List ─────────────────────────────────────────────
    builder
      .addCase(fetchServiceRequests.pending, (s) => {
        s.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchServiceRequests.fulfilled, (s, { payload }) => {
        s.status = ASYNC_STATUS.SUCCEEDED;
        s.list = payload?.data || payload || [];
        s.total = payload?.total || s.list.length;
        s.totalPages = payload?.last_page || 0;
        s.page = payload?.current_page || 1;
      })
      .addCase(fetchServiceRequests.rejected, (s, { payload }) => {
        s.status = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Single ───────────────────────────────────────────
    builder
      .addCase(fetchServiceRequest.pending, (s) => {
        s.selectedStatus = ASYNC_STATUS.LOADING;
        s.selected = null;
      })
      .addCase(fetchServiceRequest.fulfilled, (s, { payload }) => {
        s.selectedStatus = ASYNC_STATUS.SUCCEEDED;
        s.selected = payload;
      })
      .addCase(fetchServiceRequest.rejected, (s, { payload }) => {
        s.selectedStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Create ────────────────────────────────────────────
    builder
      .addCase(createServiceRequest.pending, (s) => {
        s.saveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(createServiceRequest.fulfilled, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.SUCCEEDED;
        if (payload) s.list.unshift(payload);
      })
      .addCase(createServiceRequest.rejected, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Close own ─────────────────────────────────────────
    builder.addCase(closeServiceRequest.fulfilled, (s, { payload }) => {
      patchInList(s, payload);
    });

    // ─── Delete own ────────────────────────────────────────
    builder.addCase(deleteServiceRequest.fulfilled, (s, { payload: id }) => {
      s.list = s.list.filter((r) => r.id !== id);
      if (s.selected?.id === id) s.selected = null;
    });

    // ─── Reply create ──────────────────────────────────────
    builder
      .addCase(createServiceRequestReply.pending, (s) => {
        s.replyStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(createServiceRequestReply.fulfilled, (s, { payload }) => {
        s.replyStatus = ASYNC_STATUS.SUCCEEDED;
        const { requestId, reply } = payload;
        const idx = s.list.findIndex((r) => r.id === requestId);
        if (idx !== -1) {
          s.list[idx].replies = [...(s.list[idx].replies || []), reply];
        }
        if (s.selected?.id === requestId) {
          s.selected.replies = [...(s.selected.replies || []), reply];
        }
      })
      .addCase(createServiceRequestReply.rejected, (s, { payload }) => {
        s.replyStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Reply delete (author) ─────────────────────────────
    builder.addCase(
      deleteServiceRequestReply.fulfilled,
      (s, { payload }) => {
        const { requestId, replyId } = payload;
        const idx = s.list.findIndex((r) => r.id === requestId);
        if (idx !== -1 && s.list[idx].replies) {
          s.list[idx].replies = s.list[idx].replies.filter(
            (r) => r.id !== replyId,
          );
        }
        if (s.selected?.id === requestId && s.selected.replies) {
          s.selected.replies = s.selected.replies.filter(
            (r) => r.id !== replyId,
          );
        }
      },
    );

    // ─── Admin stats ────────────────────────────────────────
    builder
      .addCase(adminFetchServiceRequestStats.pending, (s) => {
        s.statsStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchServiceRequestStats.fulfilled, (s, { payload }) => {
        s.statsStatus = ASYNC_STATUS.SUCCEEDED;
        s.stats = payload;
      })
      .addCase(adminFetchServiceRequestStats.rejected, (s, { payload }) => {
        s.statsStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Admin list ────────────────────────────────────────
    builder
      .addCase(adminFetchServiceRequests.pending, (s) => {
        s.status = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchServiceRequests.fulfilled, (s, { payload }) => {
        s.status = ASYNC_STATUS.SUCCEEDED;
        s.list = payload?.data || payload || [];
        s.total = payload?.total || s.list.length;
        s.totalPages = payload?.last_page || 0;
        s.page = payload?.current_page || 1;
      })
      .addCase(adminFetchServiceRequests.rejected, (s, { payload }) => {
        s.status = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Admin delete post ─────────────────────────────────
    builder.addCase(
      adminDeleteServiceRequest.fulfilled,
      (s, { payload: id }) => {
        s.list = s.list.filter((r) => r.id !== id);
        if (s.selected?.id === id) s.selected = null;
      },
    );

    // ─── Admin delete reply ────────────────────────────────
    builder.addCase(
      adminDeleteServiceRequestReply.fulfilled,
      (s, { payload }) => {
        const { requestId, replyId } = payload;
        const idx = s.list.findIndex((r) => r.id === requestId);
        if (idx !== -1 && s.list[idx].replies) {
          s.list[idx].replies = s.list[idx].replies.filter(
            (r) => r.id !== replyId,
          );
        }
        if (s.selected?.id === requestId && s.selected.replies) {
          s.selected.replies = s.selected.replies.filter(
            (r) => r.id !== replyId,
          );
        }
      },
    );
  },
});

export const { clearSelected, clearSaveStatus } =
  serviceRequestSlice.actions;
export default serviceRequestSlice.reducer;
