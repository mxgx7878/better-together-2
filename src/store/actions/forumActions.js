// ─── Q&A Forum Actions ────────────────────────────────────────────
// Community questions & answers. Any authenticated role (participant or
// provider) can ask and answer, so all directions are supported.
// Admin endpoints handle moderation (pin / open-close / delete).

import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// PUBLIC (authenticated) — list / view
// ═══════════════════════════════════════════════════════════════════

export const fetchForumQuestions = createAsyncThunk(
  "forum/fetchQuestions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/forum/questions", { params });
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load questions");
    }
  },
);

export const fetchForumQuestion = createAsyncThunk(
  "forum/fetchQuestion",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/forum/questions/${id}`);
      return data.data?.question || data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load question");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// CREATE — ask / answer
// ═══════════════════════════════════════════════════════════════════

export const createForumQuestion = createAsyncThunk(
  "forum/createQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.post("/forum/questions", payload);
      toast.success(data?.message || "Your question has been posted");
      return data.data?.question || data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to post question");
      return rejectWithValue(err.message || "Failed to post question");
    }
  },
);

export const createForumAnswer = createAsyncThunk(
  "forum/createAnswer",
  async ({ questionId, payload }, { rejectWithValue }) => {
    try {
      const data = await api.post(
        `/forum/questions/${questionId}/answers`,
        payload,
      );
      toast.success(data?.message || "Reply posted");
      const d = data.data || data;
      return { questionId, answer: d.answer || d };
    } catch (err) {
      toast.error(err.message || "Failed to post reply");
      return rejectWithValue(err.message || "Failed to post reply");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// DELETE — own question / answer
// ═══════════════════════════════════════════════════════════════════

export const deleteForumQuestion = createAsyncThunk(
  "forum/deleteQuestion",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/forum/questions/${id}`);
      toast.success("Question deleted");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete question");
      return rejectWithValue(err.message || "Failed to delete question");
    }
  },
);

export const deleteForumAnswer = createAsyncThunk(
  "forum/deleteAnswer",
  async ({ questionId, answerId }, { rejectWithValue }) => {
    try {
      await api.del(`/forum/answers/${answerId}`);
      toast.success("Reply removed");
      return { questionId, answerId };
    } catch (err) {
      toast.error(err.message || "Failed to remove reply");
      return rejectWithValue(err.message || "Failed to remove reply");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — moderation
// ═══════════════════════════════════════════════════════════════════

export const adminFetchForumQuestions = createAsyncThunk(
  "forum/adminFetchQuestions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/forum/questions", { params });
      return data.data || data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load questions");
    }
  },
);

export const adminToggleForumPin = createAsyncThunk(
  "forum/adminTogglePin",
  async ({ id, is_pinned }, { rejectWithValue }) => {
    try {
      const data = await api.patch(`/admin/forum/questions/${id}/pin`, {
        is_pinned,
      });
      toast.success(is_pinned ? "Pinned" : "Unpinned");
      return data.data?.question || data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to update pin");
      return rejectWithValue(err.message || "Failed to update pin");
    }
  },
);

export const adminUpdateForumStatus = createAsyncThunk(
  "forum/adminUpdateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await api.patch(`/admin/forum/questions/${id}/status`, {
        status,
      });
      toast.success(status === "closed" ? "Question closed" : "Question reopened");
      return data.data?.question || data.data || data;
    } catch (err) {
      toast.error(err.message || "Failed to update status");
      return rejectWithValue(err.message || "Failed to update status");
    }
  },
);

export const adminDeleteForumQuestion = createAsyncThunk(
  "forum/adminDeleteQuestion",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/forum/questions/${id}`);
      toast.success("Question deleted");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete question");
      return rejectWithValue(err.message || "Failed to delete question");
    }
  },
);

export const adminDeleteForumAnswer = createAsyncThunk(
  "forum/adminDeleteAnswer",
  async ({ questionId, answerId }, { rejectWithValue }) => {
    try {
      await api.del(`/admin/forum/answers/${answerId}`);
      toast.success("Reply deleted");
      return { questionId, answerId };
    } catch (err) {
      toast.error(err.message || "Failed to delete reply");
      return rejectWithValue(err.message || "Failed to delete reply");
    }
  },
);