import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchInnovationLabResources,
  fetchInnovationLabResourceById,
  fetchInnovationLabCategories,
  adminFetchInnovationLabResources,
  adminFetchInnovationLabResourceById,
  adminCreateInnovationLabResource,
  adminUpdateInnovationLabResource,
  adminDeleteInnovationLabResource,
} from "../actions/innovationLabActions";

const initialState = {
  // Provider page consumes grouped shape: [{ category, count, items: [] }]
  // Admin list consumes flat shape: [{ id, title, ... }]
  resources: [],
  groupedResources: [],
  categories: [],
  selectedResource: null,
  total: 0,
  totalPages: 0,
  page: 1,
  status: ASYNC_STATUS.IDLE,
  resourceStatus: ASYNC_STATUS.IDLE,
  error: null,
};

const innovationLabSlice = createSlice({
  name: "innovationLab",
  initialState,
  reducers: {
    clearSelectedResource(state) {
      state.selectedResource = null;
      state.resourceStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    // ─── Fetch resources (public + admin share slice) ───────────────
    const fetchResourcesFulfilled = (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;

      // Grouped public response — array of { category, count, items }
      if (Array.isArray(payload) && payload[0]?.items) {
        state.groupedResources = payload;
        state.resources = payload.flatMap((g) => g.items);
        state.total = state.resources.length;
        state.totalPages = 1;
        state.page = 1;
        return;
      }

      // Flat array
      if (Array.isArray(payload)) {
        state.resources = payload;
        state.groupedResources = [];
        state.total = payload.length;
        state.totalPages = 1;
        state.page = 1;
        return;
      }

      // Paginated shape
      state.resources = payload?.data || [];
      state.groupedResources = [];
      state.total = payload?.total || state.resources.length;
      state.totalPages = payload?.last_page || 1;
      state.page = payload?.current_page || 1;
    };

    builder
      .addCase(fetchInnovationLabResources.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchInnovationLabResources.fulfilled, fetchResourcesFulfilled)
      .addCase(fetchInnovationLabResources.rejected, (state, { payload }) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    builder
      .addCase(adminFetchInnovationLabResources.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(
        adminFetchInnovationLabResources.fulfilled,
        fetchResourcesFulfilled,
      )
      .addCase(
        adminFetchInnovationLabResources.rejected,
        (state, { payload }) => {
          state.status = ASYNC_STATUS.FAILED;
          state.error = payload;
        },
      );

    // ─── Categories ────────────────────────────────────────────────
    builder.addCase(
      fetchInnovationLabCategories.fulfilled,
      (state, { payload }) => {
        state.categories = payload || [];
      },
    );

    // ─── Fetch single ─────────────────────────────────────────────
    const fetchOneFulfilled = (state, { payload }) => {
      state.resourceStatus = ASYNC_STATUS.SUCCEEDED;
      state.selectedResource = payload;
    };

    builder
      .addCase(fetchInnovationLabResourceById.pending, (state) => {
        state.resourceStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchInnovationLabResourceById.fulfilled, fetchOneFulfilled)
      .addCase(
        fetchInnovationLabResourceById.rejected,
        (state, { payload }) => {
          state.resourceStatus = ASYNC_STATUS.FAILED;
          state.error = payload;
        },
      );

    builder
      .addCase(adminFetchInnovationLabResourceById.pending, (state) => {
        state.resourceStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchInnovationLabResourceById.fulfilled, fetchOneFulfilled)
      .addCase(
        adminFetchInnovationLabResourceById.rejected,
        (state, { payload }) => {
          state.resourceStatus = ASYNC_STATUS.FAILED;
          state.error = payload;
        },
      );

    // ─── Create ───────────────────────────────────────────────────
    builder.addCase(
      adminCreateInnovationLabResource.fulfilled,
      (state, { payload }) => {
        if (payload) state.resources.unshift(payload);
      },
    );

    // ─── Update ───────────────────────────────────────────────────
    builder.addCase(
      adminUpdateInnovationLabResource.fulfilled,
      (state, { payload }) => {
        if (!payload) return;
        const idx = state.resources.findIndex((r) => r.id === payload.id);
        if (idx !== -1) state.resources[idx] = payload;
        if (state.selectedResource?.id === payload.id) {
          state.selectedResource = payload;
        }
      },
    );

    // ─── Delete ───────────────────────────────────────────────────
    builder.addCase(
      adminDeleteInnovationLabResource.fulfilled,
      (state, { payload }) => {
        state.resources = state.resources.filter((r) => r.id !== payload);
      },
    );
  },
});

export const { clearSelectedResource } = innovationLabSlice.actions;
export default innovationLabSlice.reducer;