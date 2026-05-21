import { createSlice } from "@reduxjs/toolkit";
import {
  updateMyProfile,
  uploadAvatar,
  adminFetchUsers,
  adminFetchUser,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminApproveUser,
  adminRejectUser,
  adminSuspendUser,
  adminSetPendingUser,
  fetchUsers,
} from "../actions/userActions";
import { ASYNC_STATUS } from "../../constants";

// Helper: in-place merge of a user payload into both the list and the
// currently-selected user (when ids match).
const patchUser = (state, payload) => {
  if (!payload) return;
  const idx = state.users.findIndex((u) => u.id === payload.id);
  if (idx !== -1) state.users[idx] = { ...state.users[idx], ...payload };
  if (state.selectedUser?.id === payload.id) {
    state.selectedUser = { ...state.selectedUser, ...payload };
  }
};

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
    actionStatus: ASYNC_STATUS.IDLE,
    saveStatus: ASYNC_STATUS.IDLE,
  },
  reducers: {
    clearSelectedUser(state) {
      state.selectedUser = null;
      state.selectedUserStatus = ASYNC_STATUS.IDLE;
    },
    clearSaveStatus(state) {
      state.saveStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    // ─── Update my profile ──────────────────────────────────────
    builder
      .addCase(updateMyProfile.pending, (state) => {
        state.saveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(updateMyProfile.fulfilled, (state) => {
        state.saveStatus = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(updateMyProfile.rejected, (state, { payload }) => {
        state.saveStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Upload avatar ──────────────────────────────────────────
    builder.addCase(uploadAvatar.fulfilled, (state, { payload }) => {
      if (state.selectedUser && payload?.avatar_url) {
        state.selectedUser.avatar_url = payload.avatar_url;
      }
    });

    // ─── Fetch all users (paginated, admin) ─────────────────────
    builder
      .addCase(adminFetchUsers.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchUsers.fulfilled, (state, { payload }) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.users = payload?.data || [];
        state.total = payload?.total || 0;
        state.totalPages = payload?.last_page || 0;
        state.page = payload?.current_page || 1;
      })
      .addCase(adminFetchUsers.rejected, (state, { payload }) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Fetch single user ──────────────────────────────────────
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

    // ─── Admin create user ──────────────────────────────────────
    builder
      .addCase(adminCreateUser.pending, (state) => {
        state.saveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminCreateUser.fulfilled, (state) => {
        state.saveStatus = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(adminCreateUser.rejected, (state, { payload }) => {
        state.saveStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Admin update user ──────────────────────────────────────
    builder
      .addCase(adminUpdateUser.pending, (state) => {
        state.saveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminUpdateUser.fulfilled, (state, { payload }) => {
        state.users = state.users.map((u) =>
          u.id === payload.id ? payload : u,
        );
        state.saveStatus = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(adminUpdateUser.rejected, (state, { payload }) => {
        state.saveStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Admin delete user ──────────────────────────────────────
    // Removes the user from the paginated list, clears selectedUser
    // if it was the same one, and decrements the total count.
    builder
      .addCase(adminDeleteUser.pending, (state) => {
        state.actionStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminDeleteUser.fulfilled, (state, { payload: userId }) => {
        state.actionStatus = ASYNC_STATUS.SUCCEEDED;
        state.users = (state.users || []).filter((u) => u.id !== userId);
        if (state.selectedUser?.id === userId) {
          state.selectedUser = null;
        }
        if (typeof state.total === "number" && state.total > 0) {
          state.total -= 1;
        }
      })
      .addCase(adminDeleteUser.rejected, (state, { payload }) => {
        state.actionStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Approve ─────────────────────────────────────────────────
    builder
      .addCase(adminApproveUser.pending, (s) => {
        s.actionStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminApproveUser.fulfilled, (s, { payload }) => {
        s.actionStatus = ASYNC_STATUS.SUCCEEDED;
        patchUser(s, payload);
      })
      .addCase(adminApproveUser.rejected, (s, { payload }) => {
        s.actionStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Reject ──────────────────────────────────────────────────
    builder
      .addCase(adminRejectUser.pending, (s) => {
        s.actionStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminRejectUser.fulfilled, (s, { payload }) => {
        s.actionStatus = ASYNC_STATUS.SUCCEEDED;
        patchUser(s, payload);
      })
      .addCase(adminRejectUser.rejected, (s, { payload }) => {
        s.actionStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Suspend ─────────────────────────────────────────────────
    builder
      .addCase(adminSuspendUser.pending, (s) => {
        s.actionStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminSuspendUser.fulfilled, (s, { payload }) => {
        s.actionStatus = ASYNC_STATUS.SUCCEEDED;
        patchUser(s, payload);
      })
      .addCase(adminSuspendUser.rejected, (s, { payload }) => {
        s.actionStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Set Pending ─────────────────────────────────────────────
    builder
      .addCase(adminSetPendingUser.pending, (s) => {
        s.actionStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminSetPendingUser.fulfilled, (s, { payload }) => {
        s.actionStatus = ASYNC_STATUS.SUCCEEDED;
        patchUser(s, payload);
      })
      .addCase(adminSetPendingUser.rejected, (s, { payload }) => {
        s.actionStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Public fetch (directory pages) ─────────────────────────
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        // Backend returns Laravel paginator under `data` key
        state.users = payload?.data || [];
        state.total = payload?.total ?? state.users.length;
        state.totalPages = payload?.last_page ?? 0;
        state.page = payload?.current_page ?? 1;
      })
      .addCase(fetchUsers.rejected, (state, { payload }) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = payload;
      });
  },
});

export const { clearSelectedUser, clearSaveStatus } = userSlice.actions;
export default userSlice.reducer;