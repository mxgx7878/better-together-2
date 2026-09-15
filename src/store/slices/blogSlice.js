import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchBlogPosts,
  fetchBlogPostBySlug,
  fetchBlogCategories,
  adminFetchBlogPosts,
  adminFetchBlogStats,
  adminFetchBlogPostById,
  adminCreateBlogPost,
  adminUpdateBlogPost,
  adminUpdateBlogPostStatus,
  adminDeleteBlogPost,
  adminFetchBlogCategories,
  adminCreateBlogCategory,
  adminUpdateBlogCategory,
  adminDeleteBlogCategory,
} from "../actions/blogActions";

const initialState = {
  posts: [],
  categories: [],
  selectedPost: null,
  seo: null,
  related: [],
  stats: null,
  total: 0,
  totalPages: 0,
  page: 1,
  status: ASYNC_STATUS.IDLE,
  postStatus: ASYNC_STATUS.IDLE,
  categoryStatus: ASYNC_STATUS.IDLE,
  error: null,
};

// Public list and admin list share the same paginated envelope.
const listPending = (state) => {
  state.status = ASYNC_STATUS.LOADING;
};

const listFulfilled = (state, { payload }) => {
  state.status = ASYNC_STATUS.SUCCEEDED;
  state.posts = payload?.data || [];
  state.total = payload?.total ?? state.posts.length;
  state.totalPages = payload?.last_page || 1;
  state.page = payload?.current_page || 1;
};

const listRejected = (state, { payload }) => {
  state.status = ASYNC_STATUS.FAILED;
  state.error = payload;
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearSelectedPost(state) {
      state.selectedPost = null;
      state.seo = null;
      state.related = [];
      state.postStatus = ASYNC_STATUS.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ─── Lists ────────────────────────────────────────────────────
    builder
      .addCase(fetchBlogPosts.pending, listPending)
      .addCase(fetchBlogPosts.fulfilled, listFulfilled)
      .addCase(fetchBlogPosts.rejected, listRejected)
      .addCase(adminFetchBlogPosts.pending, listPending)
      .addCase(adminFetchBlogPosts.fulfilled, listFulfilled)
      .addCase(adminFetchBlogPosts.rejected, listRejected);

    // ─── Categories ───────────────────────────────────────────────
    const categoriesFulfilled = (state, { payload }) => {
      state.categoryStatus = ASYNC_STATUS.SUCCEEDED;
      state.categories = payload || [];
    };

    builder
      .addCase(fetchBlogCategories.pending, (state) => {
        state.categoryStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchBlogCategories.fulfilled, categoriesFulfilled)
      .addCase(fetchBlogCategories.rejected, (state, { payload }) => {
        state.categoryStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      })
      .addCase(adminFetchBlogCategories.pending, (state) => {
        state.categoryStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchBlogCategories.fulfilled, categoriesFulfilled)
      .addCase(adminFetchBlogCategories.rejected, (state, { payload }) => {
        state.categoryStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    builder
      .addCase(adminCreateBlogCategory.fulfilled, (state, { payload }) => {
        if (payload) state.categories.push(payload);
      })
      .addCase(adminUpdateBlogCategory.fulfilled, (state, { payload }) => {
        if (!payload) return;
        const idx = state.categories.findIndex((c) => c.id === payload.id);
        if (idx !== -1) state.categories[idx] = payload;
      })
      .addCase(adminDeleteBlogCategory.fulfilled, (state, { payload }) => {
        state.categories = state.categories.filter((c) => c.id !== payload);
      });

    // ─── Public single post (slug) ────────────────────────────────
    builder
      .addCase(fetchBlogPostBySlug.pending, (state) => {
        state.postStatus = ASYNC_STATUS.LOADING;
        state.error = null;
      })
      .addCase(fetchBlogPostBySlug.fulfilled, (state, { payload }) => {
        state.postStatus = ASYNC_STATUS.SUCCEEDED;
        state.selectedPost = payload?.post || null;
        state.seo = payload?.seo || null;
        state.related = payload?.related || [];
      })
      .addCase(fetchBlogPostBySlug.rejected, (state, { payload }) => {
        state.postStatus = ASYNC_STATUS.FAILED;
        state.selectedPost = null;
        state.error = payload;
      });

    // ─── Admin single post (id) ───────────────────────────────────
    builder
      .addCase(adminFetchBlogPostById.pending, (state) => {
        state.postStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchBlogPostById.fulfilled, (state, { payload }) => {
        state.postStatus = ASYNC_STATUS.SUCCEEDED;
        state.selectedPost = payload;
      })
      .addCase(adminFetchBlogPostById.rejected, (state, { payload }) => {
        state.postStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Admin mutations ──────────────────────────────────────────
    builder
      .addCase(adminFetchBlogStats.fulfilled, (state, { payload }) => {
        state.stats = payload || null;
      })
      .addCase(adminCreateBlogPost.fulfilled, (state, { payload }) => {
        if (payload) state.posts.unshift(payload);
      });

    const upsertPost = (state, { payload }) => {
      if (!payload) return;
      const idx = state.posts.findIndex((p) => p.id === payload.id);
      // The status endpoint returns the card shape — merge so the list keeps
      // whatever richer fields it already had.
      if (idx !== -1) state.posts[idx] = { ...state.posts[idx], ...payload };
      if (state.selectedPost?.id === payload.id) {
        state.selectedPost = { ...state.selectedPost, ...payload };
      }
    };

    builder
      .addCase(adminUpdateBlogPost.fulfilled, upsertPost)
      .addCase(adminUpdateBlogPostStatus.fulfilled, upsertPost)
      .addCase(adminDeleteBlogPost.fulfilled, (state, { payload }) => {
        state.posts = state.posts.filter((p) => p.id !== payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { clearSelectedPost } = blogSlice.actions;
export default blogSlice.reducer;
