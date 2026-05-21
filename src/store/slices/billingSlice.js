// src/store/slices/billingSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  fetchTransactions,
} from "../actions/billingActions";

const billingSlice = createSlice({
  name: "billing",
  initialState: {
    // ── Payment Methods ───────────────────────────────────
    cards: [],
    defaultPaymentMethodId: null,
    cardsStatus: ASYNC_STATUS.IDLE,
    addCardStatus: ASYNC_STATUS.IDLE,

    // ── Transactions ──────────────────────────────────────
    transactions: {
      items: [],
      page: 1,
      per_page: 15,
      total: 0,
      total_pages: 0,
    },
    transactionsStatus: ASYNC_STATUS.IDLE,

    error: null,
  },
  reducers: {
    clearAddCardStatus(state) {
      state.addCardStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    // ─── Payment Methods List ───────────────────────────
    builder
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.cardsStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, { payload }) => {
        state.cardsStatus = ASYNC_STATUS.SUCCEEDED;
        state.cards = payload?.cards || [];
        state.defaultPaymentMethodId = payload?.default_payment_method_id || null;
      })
      .addCase(fetchPaymentMethods.rejected, (state, { payload }) => {
        state.cardsStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Add Card ────────────────────────────────────────
    builder
      .addCase(addPaymentMethod.pending, (state) => {
        state.addCardStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(addPaymentMethod.fulfilled, (state) => {
        state.addCardStatus = ASYNC_STATUS.SUCCEEDED;
      })
      .addCase(addPaymentMethod.rejected, (state, { payload }) => {
        state.addCardStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Remove + Default — just reflect via fetchPaymentMethods dispatch ──
    builder
      .addCase(removePaymentMethod.fulfilled, (state, { payload }) => {
        state.cards = state.cards.filter((c) => c.id !== payload);
      })
      .addCase(setDefaultPaymentMethod.fulfilled, (state, { payload }) => {
        state.defaultPaymentMethodId = payload;
        state.cards = state.cards.map((c) => ({ ...c, is_default: c.id === payload }));
      });

    // ─── Transactions ────────────────────────────────────
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.transactionsStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchTransactions.fulfilled, (state, { payload }) => {
        state.transactionsStatus = ASYNC_STATUS.SUCCEEDED;
        state.transactions = payload || state.transactions;
      })
      .addCase(fetchTransactions.rejected, (state, { payload }) => {
        state.transactionsStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });
  },
});

export const { clearAddCardStatus } = billingSlice.actions;

// ─── Selectors ────────────────────────────────────────────
export const selectCards                  = (state) => state.billing.cards;
export const selectDefaultPaymentMethodId = (state) => state.billing.defaultPaymentMethodId;
export const selectCardsStatus            = (state) => state.billing.cardsStatus;
export const selectAddCardStatus          = (state) => state.billing.addCardStatus;
export const selectTransactions           = (state) => state.billing.transactions;
export const selectTransactionsStatus     = (state) => state.billing.transactionsStatus;

export default billingSlice.reducer;