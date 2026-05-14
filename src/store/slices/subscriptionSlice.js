import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchPublicSubscriptions,
  adminFetchSubscriptions,
  adminFetchSubscriptionById,
  adminCreateSubscription,
  adminUpdateSubscription,
  adminDeleteSubscription,
  fetchMySubscription,
  changePlan,
  cancelPendingPlan,
} from "../actions/subscriptionActions";

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    // Admin list
    subscriptions: [],
    selectedSubscription: null,
    status: ASYNC_STATUS.IDLE,
    // Public list (separate state to avoid clobbering admin paginated list)
    publicSubscriptions: [],
    publicStatus: ASYNC_STATUS.IDLE,
    mySubscription: null,
    myStatus: ASYNC_STATUS.IDLE,
    lastInvoice: null,
    changePlanStatus: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {
    clearSelectedSubscription(state) {
      state.selectedSubscription = null;
    },
    clearLastInvoice(state) {
      state.lastInvoice = null;
    },
    clearChangePlanStatus(state) {
      state.changePlanStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    // ─── Public Fetch ───────────────────────────────────────────
    builder.addCase(fetchPublicSubscriptions.pending, (state) => {
      state.publicStatus = ASYNC_STATUS.LOADING;
    });
    builder.addCase(
      fetchPublicSubscriptions.fulfilled,
      (state, { payload }) => {
        state.publicStatus = ASYNC_STATUS.SUCCEEDED;
        state.publicSubscriptions = payload?.data || [];
      },
    );
    builder.addCase(fetchPublicSubscriptions.rejected, (state, { payload }) => {
      state.publicStatus = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

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

    builder.addCase(fetchMySubscription.pending, (state) => {
      state.myStatus = ASYNC_STATUS.LOADING;
    });
    builder.addCase(fetchMySubscription.fulfilled, (state, { payload }) => {
      state.myStatus = ASYNC_STATUS.SUCCEEDED;
      state.mySubscription = payload;
    });
    builder.addCase(fetchMySubscription.rejected, (state, { payload }) => {
      state.myStatus = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Change Plan ─────────────────────────────────────────────
    builder.addCase(changePlan.pending, (state) => {
      state.changePlanStatus = ASYNC_STATUS.LOADING;
      state.lastInvoice = null;
    });
    builder.addCase(changePlan.fulfilled, (state, { payload }) => {
      state.changePlanStatus = ASYNC_STATUS.SUCCEEDED;
      // Upgrade response: { subscription, invoice }
      // Downgrade response: subscriber object directly
      if (payload?.subscription) {
        state.mySubscription = payload.subscription;
        state.lastInvoice = payload.invoice || null;
      } else {
        state.mySubscription = payload;
      }
    });
    builder.addCase(changePlan.rejected, (state, { payload }) => {
      state.changePlanStatus = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Cancel Pending Downgrade ───────────────────────────────
    builder.addCase(cancelPendingPlan.fulfilled, (state, { payload }) => {
      state.mySubscription = payload;
    });
  },
});

export const {
  clearSelectedSubscription,
  clearLastInvoice,
  clearChangePlanStatus,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
