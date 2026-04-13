import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  adminFetchSubscriptions,
  adminFetchSubscriptionById,
  adminCreateSubscription,
  adminUpdateSubscription,
  adminDeleteSubscription,
} from "../actions/subscriptionActions";

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscriptions: [],
    selectedSubscription: null,
    status: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {
    clearSelectedSubscription(state) {
      state.selectedSubscription = null;
    },
  },
  extraReducers: (builder) => {
    // ─── Admin Fetch All ────────────────────────────────────────
    builder.addCase(adminFetchSubscriptions.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminFetchSubscriptions.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.subscriptions = payload?.data || [];
    });
    builder.addCase(adminFetchSubscriptions.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Fetch Single ─────────────────────────────────────
    builder.addCase(adminFetchSubscriptionById.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(
      adminFetchSubscriptionById.fulfilled,
      (state, { payload }) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.selectedSubscription = payload?.data || null;
      },
    );
    builder.addCase(
      adminFetchSubscriptionById.rejected,
      (state, { payload }) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = payload;
      },
    );

    // ─── Admin Create ───────────────────────────────────────────
    builder.addCase(adminCreateSubscription.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminCreateSubscription.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      const newSub = payload?.data || payload;
      if (newSub) {
        state.subscriptions.unshift(newSub);
      }
    });
    builder.addCase(adminCreateSubscription.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Update ───────────────────────────────────────────
    builder.addCase(adminUpdateSubscription.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminUpdateSubscription.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      const updated = payload?.data || payload;
      if (updated) {
        const index = state.subscriptions.findIndex((s) => s.id === updated.id);
        if (index !== -1) {
          state.subscriptions[index] = updated;
        }
      }
    });
    builder.addCase(adminUpdateSubscription.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Delete ───────────────────────────────────────────
    builder.addCase(adminDeleteSubscription.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminDeleteSubscription.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.subscriptions = state.subscriptions.filter((s) => s.id !== payload);
    });
    builder.addCase(adminDeleteSubscription.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });
  },
});

export const { clearSelectedSubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
