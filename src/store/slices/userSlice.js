import { createSlice } from "@reduxjs/toolkit";
import { adminFetchUsers, adminFetchUser } from "../actions/userActions";
import { ASYNC_STATUS } from "../../constants";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    status: ASYNC_STATUS.IDLE,
    total: 0,
    totalPages: 0,
    page: 1,
    error: null,
    selectedUser: null,
    selectedUserStatus: ASYNC_STATUS.IDLE,
  },
  reducers: {
    setUser(state, action) { state.users = [action.payload]; },
    clearUser(state) { state.users = []; },
    clearSelectedUser(state) { state.selectedUser = null; state.selectedUserStatus = ASYNC_STATUS.IDLE; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminFetchUsers.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchUsers.fulfilled, (state, { payload }) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.users = payload.data;
        state.total = payload.total;
        state.totalPages = payload.totalPages;
        state.page = payload.page;
      })
      .addCase(adminFetchUsers.rejected, (state, { payload }) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = payload;
      })
      .addCase(adminFetchUser.pending, (state) => {
        state.selectedUserStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchUser.fulfilled, (state, { payload }) => {
        state.selectedUserStatus = ASYNC_STATUS.SUCCEEDED;
        state.selectedUser = payload.data;
      })
      .addCase(adminFetchUser.rejected, (state, { payload }) => {
        state.selectedUserStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });
  },
});

export const { setUser, clearUser, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;