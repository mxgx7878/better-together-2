import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// PAYMENT METHODS
//   Stripe-direct — no local payment_methods table. Backend retrieves
//   from Stripe customer on every call.
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/payment-methods
 * Response: { data: { default_payment_method_id, cards: [...] } }
 */
export const fetchPaymentMethods = createAsyncThunk(
  "billing/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/payment-methods");
      return data?.data || { default_payment_method_id: null, cards: [] };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load payment methods");
    }
  },
);

/**
 * POST /api/payment-methods
 * Body: { payment_method_id, set_default?: bool }
 * After success → refetches list so UI reflects default + new card.
 */
export const addPaymentMethod = createAsyncThunk(
  "billing/addPaymentMethod",
  async ({ payment_method_id, set_default = false }, { rejectWithValue, dispatch }) => {
    try {
      const data = await api.post("/payment-methods", {
        payment_method_id,
        set_default,
      });
      toast.success(data?.message || "Card added");
      dispatch(fetchPaymentMethods());
      return data?.data;
    } catch (err) {
      toast.error(err.message || "Failed to add card");
      return rejectWithValue(err.message || "Failed to add card");
    }
  },
);

/**
 * DELETE /api/payment-methods/{id}
 */
export const removePaymentMethod = createAsyncThunk(
  "billing/removePaymentMethod",
  async (paymentMethodId, { rejectWithValue, dispatch }) => {
    try {
      const data = await api.del(`/payment-methods/${paymentMethodId}`);
      toast.success(data?.message || "Card removed");
      dispatch(fetchPaymentMethods());
      return paymentMethodId;
    } catch (err) {
      toast.error(err.message || "Failed to remove card");
      return rejectWithValue(err.message || "Failed to remove card");
    }
  },
);

/**
 * PUT /api/payment-methods/{id}/default
 */
export const setDefaultPaymentMethod = createAsyncThunk(
  "billing/setDefaultPaymentMethod",
  async (paymentMethodId, { rejectWithValue, dispatch }) => {
    try {
      const data = await api.put(`/payment-methods/${paymentMethodId}/default`);
      toast.success(data?.message || "Default card updated");
      dispatch(fetchPaymentMethods());
      return paymentMethodId;
    } catch (err) {
      toast.error(err.message || "Failed to set default");
      return rejectWithValue(err.message || "Failed to set default");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// TRANSACTIONS / INVOICE HISTORY
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/transactions
 * Query: page, per_page, from (YYYY-MM-DD), to (YYYY-MM-DD), status
 * Response: { data: { items, page, per_page, total, total_pages } }
 */
export const fetchTransactions = createAsyncThunk(
  "billing/fetchTransactions",
  async ({ page = 1, per_page = 15, from, to, status } = {}, { rejectWithValue }) => {
    try {
      const params = { page, per_page };
      if (from)   params.from = from;
      if (to)     params.to = to;
      if (status) params.status = status;

      const data = await api.get("/transactions", { params });
      return data?.data || { items: [], page: 1, per_page, total: 0, total_pages: 0 };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load transactions");
    }
  },
);

export const createCardSetupIntent = createAsyncThunk(
  "billing/createCardSetupIntent",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.post("/subscription/setup-intent");
      return data?.data || {};
    } catch (err) {
      return rejectWithValue(err.message || "Failed to start card setup");
    }
  },
);