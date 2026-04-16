import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMyProfile,
  updateMyProfile,
  uploadAvatar,
  adminCreateUser,
  adminUpdateUser,
} from "../actions/profileActions";
import { ASYNC_STATUS } from "../../constants";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    status: ASYNC_STATUS.IDLE,
    saveStatus: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {
    clearProfile(state) {
      state.profile = null;
      state.status = ASYNC_STATUS.IDLE;
      state.saveStatus = ASYNC_STATUS.IDLE;
      state.error = null;
    },
    clearSaveStatus(state) {
      state.saveStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    // ─── Fetch my profile ───────────────────────────────────────
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchMyProfile.fulfilled, (state, { payload }) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.profile = payload;
      })
      .addCase(fetchMyProfile.rejected, (state, { payload }) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Update my profile ──────────────────────────────────────
    builder
      .addCase(updateMyProfile.pending, (state) => {
        state.saveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(updateMyProfile.fulfilled, (state, { payload }) => {
        state.saveStatus = ASYNC_STATUS.SUCCEEDED;
        state.profile = payload;
      })
      .addCase(updateMyProfile.rejected, (state, { payload }) => {
        state.saveStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Upload avatar ──────────────────────────────────────────
    builder.addCase(uploadAvatar.fulfilled, (state, { payload }) => {
      if (state.profile && payload?.avatar_url) {
        state.profile.avatar_url = payload.avatar_url;
      }
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
      .addCase(adminUpdateUser.fulfilled, (state) => {
        state.saveStatus = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(adminUpdateUser.rejected, (state, { payload }) => {
        state.saveStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });
  },
});

export const { clearProfile, clearSaveStatus } = profileSlice.actions;

export default profileSlice.reducer;
