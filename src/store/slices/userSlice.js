import { createSlice } from "@reduxjs/toolkit";
import {
  adminFetchUsers,
  adminFetchUser,
  adminToggleUserStatus,
} from "../actions/userActions";
import { ASYNC_STATUS } from "../../constants";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    total: 0,
    totalPages: 0,
    page: 1,
    status: ASYNC_STATUS.IDLE,
    error: null,
    selectedUser: null,
    selectedUserStatus: ASYNC_STATUS.IDLE,
  },
  reducers: {
    clearSelectedUser(state) {
      state.selectedUser = null;
      state.selectedUserStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    // ─── Fetch all users (paginated) ─────────────────────────────
    builder
      .addCase(adminFetchUsers.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchUsers.fulfilled, (state, { payload }) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        // Laravel paginator format
        state.users = payload?.data || [];
        state.total = payload?.total || 0;
        state.totalPages = payload?.last_page || 0;
        state.page = payload?.current_page || 1;
      })
      .addCase(adminFetchUsers.rejected, (state, { payload }) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Fetch single user ───────────────────────────────────────
    builder
      .addCase(adminFetchUser.pending, (state) => {
        state.selectedUserStatus = ASYNC_STATUS.LOADING;
        state.selectedUser = null;
      })
      .addCase(adminFetchUser.fulfilled, (state, { payload }) => {
        state.selectedUserStatus = ASYNC_STATUS.SUCCEEDED;
        state.selectedUser = payload;
      })
      .addCase(adminFetchUser.rejected, (state, { payload }) => {
        state.selectedUserStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Toggle user status (activate / deactivate) ──────────────
    builder.addCase(adminToggleUserStatus.fulfilled, (state, { payload }) => {
      if (!payload) return;
      const idx = state.users.findIndex((u) => u.id === payload.id);
      if (idx !== -1) state.users[idx] = { ...state.users[idx], ...payload };
      if (state.selectedUser?.id === payload.id) {
        state.selectedUser = { ...state.selectedUser, ...payload };
      }
    });
  },
});

export const { clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
