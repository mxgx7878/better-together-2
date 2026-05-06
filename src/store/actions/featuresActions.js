// ─── Features Actions ─────────────────────────────────────────────
// Admin can ONLY READ features. Features are referenced by id when
// creating/updating subscription plans (passed as features[].id in
// the subscription payload). No create/update/delete from the
// frontend — features are managed server-side / by seeding.
//
// Backend route: GET /api/admin/features

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/**
 * GET /api/admin/features
 * Optional query params:
 *   - type: 'participant' | 'provider'  (returns matching + 'both')
 *   - status: 1 | 0
 *
 * Results are ordered by sort_order ASC. No pagination.
 *
 * Used by ManageSubscriptionsPage to populate the feature picker
 * inside the create/edit subscription modal.
 */
export const adminFetchFeatures = createAsyncThunk(
  "features/adminFetchFeatures",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/features", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch features");
    }
  },
);