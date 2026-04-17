import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../../services/api";

// ═══════════════════════════════════════════════════════════════════
// ADMIN — Learning Modules
// ═══════════════════════════════════════════════════════════════════

export const adminFetchLearningModules = createAsyncThunk(
  "learning/adminFetchLearningModules",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/admin/learning-modules", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch modules");
    }
  },
);

export const adminFetchLearningModuleById = createAsyncThunk(
  "learning/adminFetchLearningModuleById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/admin/learning-modules/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch module");
    }
  },
);

export const adminCreateLearningModule = createAsyncThunk(
  "learning/adminCreateLearningModule",
  async (moduleData, { rejectWithValue }) => {
    try {
      const data = await api.post("/admin/learning-modules", moduleData);
      toast.success("Learning module created successfully!");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to create module");
      return rejectWithValue(err.message || "Failed to create module");
    }
  },
);

export const adminUpdateLearningModule = createAsyncThunk(
  "learning/adminUpdateLearningModule",
  async ({ id, moduleData }, { rejectWithValue }) => {
    try {
      const data = await api.put(`/admin/learning-modules/${id}`, moduleData);
      toast.success("Learning module updated successfully!");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to update module");
      return rejectWithValue(err.message || "Failed to update module");
    }
  },
);

export const adminDeleteLearningModule = createAsyncThunk(
  "learning/adminDeleteLearningModule",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/learning-modules/${id}`);
      toast.success("Learning module deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete module");
      return rejectWithValue(err.message || "Failed to delete module");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN — Learning Lessons
// ═══════════════════════════════════════════════════════════════════

export const adminFetchLessonById = createAsyncThunk(
  "learning/adminFetchLessonById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/admin/learning-lessons/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch lesson");
    }
  },
);

export const adminCreateLesson = createAsyncThunk(
  "learning/adminCreateLesson",
  async ({ moduleId, lessonData }, { rejectWithValue }) => {
    try {
      const data = await api.post(
        `/admin/learning-modules/${moduleId}/lessons`,
        lessonData,
      );
      toast.success("Lesson created successfully!");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to create lesson");
      return rejectWithValue(err.message || "Failed to create lesson");
    }
  },
);

export const adminUpdateLesson = createAsyncThunk(
  "learning/adminUpdateLesson",
  async ({ id, lessonData }, { rejectWithValue }) => {
    try {
      const data = await api.put(`/admin/learning-lessons/${id}`, lessonData);
      toast.success("Lesson updated successfully!");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to update lesson");
      return rejectWithValue(err.message || "Failed to update lesson");
    }
  },
);

export const adminDeleteLesson = createAsyncThunk(
  "learning/adminDeleteLesson",
  async (id, { rejectWithValue }) => {
    try {
      await api.del(`/admin/learning-lessons/${id}`);
      toast.success("Lesson deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.message || "Failed to delete lesson");
      return rejectWithValue(err.message || "Failed to delete lesson");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// PUBLIC — Learning Modules (shared for provider / participant)
// ═══════════════════════════════════════════════════════════════════

export const fetchLearningModules = createAsyncThunk(
  "learning/fetchLearningModules",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await api.get("/learning-modules", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch modules");
    }
  },
);

export const fetchLearningModuleById = createAsyncThunk(
  "learning/fetchLearningModuleById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/learning-modules/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch module");
    }
  },
);

// ═══════════════════════════════════════════════════════════════════
// PARTICIPANT PROGRESS
// ═══════════════════════════════════════════════════════════════════

export const markLessonComplete = createAsyncThunk(
  "learning/markLessonComplete",
  async (lessonId, { rejectWithValue }) => {
    try {
      const data = await api.post(`/learning-lessons/${lessonId}/complete`);
      toast.success("Lesson marked as complete!");
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to update progress");
      return rejectWithValue(err.message || "Failed to update progress");
    }
  },
);

export const fetchMyLearningProgress = createAsyncThunk(
  "learning/fetchMyLearningProgress",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/my-learning-progress");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch progress");
    }
  },
);
