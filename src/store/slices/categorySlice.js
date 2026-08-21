import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  adminFetchCategories,
  adminFetchCategoryById,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  fetchPublicCategories,
} from "../actions/categoryActions";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    publicCategories: [],
    selectedCategory: null,
    status: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {
    clearSelectedCategory(state) {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    // ─── Admin Fetch All ────────────────────────────────────────
    builder.addCase(adminFetchCategories.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminFetchCategories.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.categories = payload?.data || [];
    });
    builder.addCase(adminFetchCategories.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Fetch Single ─────────────────────────────────────
    builder.addCase(adminFetchCategoryById.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminFetchCategoryById.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.selectedCategory = payload?.data || null;
    });
    builder.addCase(adminFetchCategoryById.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Create ───────────────────────────────────────────
    builder.addCase(adminCreateCategory.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminCreateCategory.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      const newCategory = payload?.data || payload;
      if (newCategory) {
        state.categories.unshift(newCategory);
      }
    });
    builder.addCase(adminCreateCategory.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Update ───────────────────────────────────────────
    builder.addCase(adminUpdateCategory.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminUpdateCategory.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      const updated = payload?.data || payload;
      if (updated) {
        const index = state.categories.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.categories[index] = updated;
        }
      }
    });
    builder.addCase(adminUpdateCategory.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Admin Delete ───────────────────────────────────────────
    builder.addCase(adminDeleteCategory.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminDeleteCategory.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.categories = state.categories.filter((c) => c.id !== payload);
    });
    builder.addCase(adminDeleteCategory.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    // ─── Public Fetch Categories ────────────────────────────────
    builder.addCase(fetchPublicCategories.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(fetchPublicCategories.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.publicCategories = payload?.data || [];
    });
    builder.addCase(fetchPublicCategories.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });
  },
});

export const { clearSelectedCategory } = categorySlice.actions;

export default categorySlice.reducer;
