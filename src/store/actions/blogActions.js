import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// PUBLIC — Blog (marketing site)
// ═══════════════════════════════════════════════════════════════════

export const fetchBlogPosts = createAsyncThunk(
  "blog/fetchPosts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/blogs", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch posts");
    }
  },
);

/** Loads a post by its SEO slug — returns { post, seo, related }. */
export const fetchBlogPostBySlug = createAsyncThunk(
  "blog/fetchPostBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const data = await api.get(`/blogs/${slug}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Post not found");
    }
  },
);

export const fetchBlogCategories = createAsyncThunk(
  "blog/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/blog-categories");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch categories");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — Posts
// ═══════════════════════════════════════════════════════════════════

export const adminFetchBlogPosts = createAsyncThunk(
  "blog/adminFetchPosts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/blogs", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch posts");
    }
  },
);

export const adminFetchBlogStats = createAsyncThunk(
  "blog/adminFetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/blogs/stats");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch stats");
    }
  },
);

export const adminFetchBlogPostById = createAsyncThunk(
  "blog/adminFetchPostById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/admin/blogs/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch post");
    }
  },
);

export const adminCreateBlogPost = createAsyncThunk(
  "blog/adminCreatePost",
  async (postData, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/blogs", postData);
      toast.success("Post created successfully!");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to create post");
      return rejectWithValue(err.message || "Failed to create post");
    }
  },
);

export const adminUpdateBlogPost = createAsyncThunk(
  "blog/adminUpdatePost",
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const data = await api.put(`/admin/blogs/${id}`, postData);
      toast.success("Post updated successfully!");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to update post");
      return rejectWithValue(err.message || "Failed to update post");
    }
  },
);

/** Inline publish / unpublish / feature toggle from the admin list. */
export const adminUpdateBlogPostStatus = createAsyncThunk(
  "blog/adminUpdatePostStatus",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const data = await api.patch(`/admin/blogs/${id}/status`, payload);
      toast.success("Post updated");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to update post");
      return rejectWithValue(err.message || "Failed to update post");
    }
  },
);

export const adminDeleteBlogPost = createAsyncThunk(
  "blog/adminDeletePost",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/blogs/${id}`);
      toast.success("Post deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete post");
      return rejectWithValue(err.message || "Failed to delete post");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — Categories
// ═══════════════════════════════════════════════════════════════════

export const adminFetchBlogCategories = createAsyncThunk(
  "blog/adminFetchCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/blog-categories", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch categories");
    }
  },
);

export const adminCreateBlogCategory = createAsyncThunk(
  "blog/adminCreateCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/blog-categories", categoryData);
      toast.success("Category created successfully!");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to create category");
      return rejectWithValue(err.message || "Failed to create category");
    }
  },
);

export const adminUpdateBlogCategory = createAsyncThunk(
  "blog/adminUpdateCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const data = await api.post(`/admin/blog-categories/${id}`, categoryData);
      toast.success("Category updated successfully!");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to update category");
      return rejectWithValue(err.message || "Failed to update category");
    }
  },
);

export const adminDeleteBlogCategory = createAsyncThunk(
  "blog/adminDeleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.del(`/admin/blog-categories/${id}`);
      toast.success(data?.message || "Category deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
      return rejectWithValue(err.message || "Failed to delete category");
    }
  },
);
