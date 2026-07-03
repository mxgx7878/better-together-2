import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchMyBuddy,
  adminFetchBuddies,
  adminCreateBuddy,
  adminUpdateBuddy,
  adminDeleteBuddy,
  adminFetchBuddyAssignments,
  adminAssignBuddy,
} from "../actions/buddyActions";

const buddySlice = createSlice({
  name: "buddy",
  initialState: {
    // participant
    myBuddy: null,
    myStatus: ASYNC_STATUS.IDLE,
    // admin buddy profiles
    buddies: [],
    status: ASYNC_STATUS.IDLE,
    saveStatus: ASYNC_STATUS.IDLE,
    // admin assignment requests
    assignments: [],
    pendingCount: 0,
    assignmentsStatus: ASYNC_STATUS.IDLE,
    assignStatus: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // ── my buddy ──
    builder
      .addCase(fetchMyBuddy.pending, (s) => {
        s.myStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchMyBuddy.fulfilled, (s, { payload }) => {
        s.myStatus = ASYNC_STATUS.SUCCEEDED;
        s.myBuddy = payload || null;
      })
      .addCase(fetchMyBuddy.rejected, (s, { payload }) => {
        s.myStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ── admin buddies list ──
    builder
      .addCase(adminFetchBuddies.pending, (s) => {
        s.status = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchBuddies.fulfilled, (s, { payload }) => {
        s.status = ASYNC_STATUS.SUCCEEDED;
        s.buddies = payload || [];
      })
      .addCase(adminFetchBuddies.rejected, (s, { payload }) => {
        s.status = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ── create ──
    builder
      .addCase(adminCreateBuddy.pending, (s) => {
        s.saveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminCreateBuddy.fulfilled, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.SUCCEEDED;
        if (payload?.id) s.buddies.unshift(payload);
      })
      .addCase(adminCreateBuddy.rejected, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ── update ──
    builder
      .addCase(adminUpdateBuddy.pending, (s) => {
        s.saveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminUpdateBuddy.fulfilled, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.SUCCEEDED;
        if (payload?.id) {
          const i = s.buddies.findIndex((b) => b.id === payload.id);
          if (i !== -1) s.buddies[i] = payload;
        }
      })
      .addCase(adminUpdateBuddy.rejected, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ── delete ──
    builder.addCase(adminDeleteBuddy.fulfilled, (s, { payload: id }) => {
      s.buddies = s.buddies.filter((b) => b.id !== id);
    });

    // ── assignments ──
    builder
      .addCase(adminFetchBuddyAssignments.pending, (s) => {
        s.assignmentsStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchBuddyAssignments.fulfilled, (s, { payload }) => {
        s.assignmentsStatus = ASYNC_STATUS.SUCCEEDED;
        s.assignments = payload?.data || [];
        s.pendingCount = payload?.pending_count ?? 0;
      })
      .addCase(adminFetchBuddyAssignments.rejected, (s, { payload }) => {
        s.assignmentsStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ── assign ──
    builder
      .addCase(adminAssignBuddy.pending, (s) => {
        s.assignStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminAssignBuddy.fulfilled, (s, { payload }) => {
        s.assignStatus = ASYNC_STATUS.SUCCEEDED;
        if (payload?.id) {
          const i = s.assignments.findIndex((a) => a.id === payload.id);
          if (i !== -1) s.assignments[i] = payload;
          s.pendingCount = s.assignments.filter((a) => a.status === "pending").length;
        }
      })
      .addCase(adminAssignBuddy.rejected, (s, { payload }) => {
        s.assignStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });
  },
});

export default buddySlice.reducer;