import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchPublicSubscriptions,
  adminFetchSubscriptions,
  adminFetchSubscriptionById,
  adminCreateSubscription,
  adminUpdateSubscription,
  adminDeleteSubscription,
  adminFetchPlanSubscribers,
  fetchMySubscription,
  changePlan,
  cancelPendingPlan,
  cancelSubscription,
  resumeSubscription,
} from "../actions/subscriptionActions";

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    // Admin list
    subscriptions: [],
    selectedSubscription: null,
    status: ASYNC_STATUS.IDLE,

    // Per-plan subscribers (for the admin "View Subscribers" modal)
    planSubscribers: {
      items: [],
      total: 0,
      totalPages: 0,
      page: 1,
    },
    planSubscribersStatus: ASYNC_STATUS.IDLE,

    // Public list
    publicSubscriptions: [],
    publicStatus: ASYNC_STATUS.IDLE,

    // Current user's subscription
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
    clearPlanSubscribers(state) {
      state.planSubscribers = { items: [], total: 0, totalPages: 0, page: 1 };
      state.planSubscribersStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    // ─── Public Fetch ───────────────────────────────────────────
    builder.addCase(fetchPublicSubscriptions.pending, (state) => {
      state.publicStatus = ASYNC_STATUS.LOADING;
    });
    builder.addCase(fetchPublicSubscriptions.fulfilled, (state, { payload }) => {
      state.publicStatus = ASYNC_STATUS.SUCCEEDED;
      state.publicSubscriptions = payload?.data || [];
    });
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
    builder.addCase(adminFetchSubscriptionById.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.selectedSubscription = payload?.data || null;
    });
    builder.addCase(adminFetchSubscriptionById.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Create ───────────────────────────────────────────
    builder.addCase(adminCreateSubscription.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminCreateSubscription.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      const newSub = payload?.data || payload;
      if (newSub) state.subscriptions.unshift(newSub);
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
        if (index !== -1) state.subscriptions[index] = updated;
      }
    });
    builder.addCase(adminUpdateSubscription.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Delete ───────────────────────────────────────────
    // Note: payload shape changed to { id, response } (or just id for legacy)
    builder.addCase(adminDeleteSubscription.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminDeleteSubscription.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      const deletedId = typeof payload === "object" ? payload.id : payload;
      state.subscriptions = state.subscriptions.filter((s) => s.id !== deletedId);
    });
    builder.addCase(adminDeleteSubscription.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Fetch Plan Subscribers ───────────────────────────
    builder.addCase(adminFetchPlanSubscribers.pending, (state) => {
      state.planSubscribersStatus = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminFetchPlanSubscribers.fulfilled, (state, { payload }) => {
      state.planSubscribersStatus = ASYNC_STATUS.SUCCEEDED;
      state.planSubscribers = {
        items:      payload?.data || [],
        total:      payload?.total || 0,
        totalPages: payload?.totalPages || 0,
        page:       payload?.page || 1,
      };
    });
    builder.addCase(adminFetchPlanSubscribers.rejected, (state, { payload }) => {
      state.planSubscribersStatus = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Fetch My Subscription ──────────────────────────────────
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

    // ─── Change Plan ────────────────────────────────────────────
    builder.addCase(changePlan.pending, (state) => {
      state.changePlanStatus = ASYNC_STATUS.LOADING;
      state.lastInvoice = null;
    });
    builder.addCase(changePlan.fulfilled, (state, { payload }) => {
      state.changePlanStatus = ASYNC_STATUS.SUCCEEDED;
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

    // ─── Cancel Subscription ────────────────────────────────────
    builder.addCase(cancelSubscription.pending, (state) => {
      state.changePlanStatus = ASYNC_STATUS.LOADING;
    });
    builder.addCase(cancelSubscription.fulfilled, (state, { payload }) => {
      state.changePlanStatus = ASYNC_STATUS.SUCCEEDED;
      state.mySubscription = payload;
    });
    builder.addCase(cancelSubscription.rejected, (state, { payload }) => {
      state.changePlanStatus = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Resume Subscription ────────────────────────────────────
    builder.addCase(resumeSubscription.pending, (state) => {
      state.changePlanStatus = ASYNC_STATUS.LOADING;
    });
    builder.addCase(resumeSubscription.fulfilled, (state, { payload }) => {
      state.changePlanStatus = ASYNC_STATUS.SUCCEEDED;
      state.mySubscription = payload;
    });
    builder.addCase(resumeSubscription.rejected, (state, { payload }) => {
      state.changePlanStatus = ASYNC_STATUS.FAILED;
      state.error = payload;
    });
  },
});

export const {
  clearSelectedSubscription,
  clearLastInvoice,
  clearChangePlanStatus,
  clearPlanSubscribers,
} = subscriptionSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────
export const selectAdminSubscriptions      = (state) => state.subscription.subscriptions;
export const selectPlanSubscribers         = (state) => state.subscription.planSubscribers;
export const selectPlanSubscribersStatus   = (state) => state.subscription.planSubscribersStatus;

export default subscriptionSlice.reducer;