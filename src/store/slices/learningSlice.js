import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  adminFetchLearningModules,
  adminFetchLearningModuleById,
  adminCreateLearningModule,
  adminUpdateLearningModule,
  adminDeleteLearningModule,
  adminFetchLessonById,
  adminCreateLesson,
  adminUpdateLesson,
  adminDeleteLesson,
  fetchLearningModules,
  fetchLearningModuleById,
  markLessonComplete,
  fetchMyLearningProgress,
} from "../actions/learningActions";

const initialState = {
  modules: [],
  total: 0,
  totalPages: 0,
  page: 1,
  selectedModule: null,
  selectedLesson: null,
  progress: [], // array of { lesson_id, completed_at }
  status: ASYNC_STATUS.IDLE,
  moduleStatus: ASYNC_STATUS.IDLE,
  lessonStatus: ASYNC_STATUS.IDLE,
  progressStatus: ASYNC_STATUS.IDLE,
  error: null,
};

const learningSlice = createSlice({
  name: "learning",
  initialState,
  reducers: {
    clearSelectedModule(state) {
      state.selectedModule = null;
      state.moduleStatus = ASYNC_STATUS.IDLE;
    },
    clearSelectedLesson(state) {
      state.selectedLesson = null;
      state.lessonStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    // ─── Fetch modules (admin + public share the same slice state) ─
    const fetchModulesFulfilled = (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      if (Array.isArray(payload)) {
        state.modules = payload;
        state.total = payload.length;
        state.totalPages = 1;
        state.page = 1;
      } else {
        state.modules = payload?.data || [];
        state.total = payload?.total || state.modules.length;
        state.totalPages = payload?.last_page || 1;
        state.page = payload?.current_page || 1;
      }
    };

    builder
      .addCase(adminFetchLearningModules.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchLearningModules.fulfilled, fetchModulesFulfilled)
      .addCase(adminFetchLearningModules.rejected, (state, { payload }) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    builder
      .addCase(fetchLearningModules.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchLearningModules.fulfilled, fetchModulesFulfilled)
      .addCase(fetchLearningModules.rejected, (state, { payload }) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Fetch single module (with lessons) ─────────────────────────
    const fetchModuleByIdFulfilled = (state, { payload }) => {
      state.moduleStatus = ASYNC_STATUS.SUCCEEDED;
      state.selectedModule = payload;
    };

    builder
      .addCase(adminFetchLearningModuleById.pending, (state) => {
        state.moduleStatus = ASYNC_STATUS.LOADING;
        state.selectedModule = null;
      })
      .addCase(adminFetchLearningModuleById.fulfilled, fetchModuleByIdFulfilled)
      .addCase(adminFetchLearningModuleById.rejected, (state, { payload }) => {
        state.moduleStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    builder
      .addCase(fetchLearningModuleById.pending, (state) => {
        state.moduleStatus = ASYNC_STATUS.LOADING;
        state.selectedModule = null;
      })
      .addCase(fetchLearningModuleById.fulfilled, fetchModuleByIdFulfilled)
      .addCase(fetchLearningModuleById.rejected, (state, { payload }) => {
        state.moduleStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    // ─── Create module ──────────────────────────────────────────────
    builder.addCase(adminCreateLearningModule.fulfilled, (state, { payload }) => {
      if (payload) state.modules.unshift(payload);
    });

    // ─── Update module ──────────────────────────────────────────────
    builder.addCase(adminUpdateLearningModule.fulfilled, (state, { payload }) => {
      if (!payload) return;
      const idx = state.modules.findIndex((m) => m.id === payload.id);
      if (idx !== -1) state.modules[idx] = payload;
      if (state.selectedModule?.id === payload.id) {
        state.selectedModule = { ...state.selectedModule, ...payload };
      }
    });

    // ─── Delete module ──────────────────────────────────────────────
    builder.addCase(adminDeleteLearningModule.fulfilled, (state, { payload }) => {
      state.modules = state.modules.filter((m) => m.id !== payload);
    });

    // ─── Lessons ────────────────────────────────────────────────────
    builder
      .addCase(adminFetchLessonById.pending, (state) => {
        state.lessonStatus = ASYNC_STATUS.LOADING;
        state.selectedLesson = null;
      })
      .addCase(adminFetchLessonById.fulfilled, (state, { payload }) => {
        state.lessonStatus = ASYNC_STATUS.SUCCEEDED;
        state.selectedLesson = payload;
      })
      .addCase(adminFetchLessonById.rejected, (state, { payload }) => {
        state.lessonStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    builder.addCase(adminCreateLesson.fulfilled, (state, { payload }) => {
      if (!payload) return;
      if (state.selectedModule?.id === payload.module_id) {
        const lessons = state.selectedModule.lessons || [];
        state.selectedModule.lessons = [...lessons, payload];
      }
    });

    builder.addCase(adminUpdateLesson.fulfilled, (state, { payload }) => {
      if (!payload) return;
      if (state.selectedModule?.lessons) {
        const idx = state.selectedModule.lessons.findIndex(
          (l) => l.id === payload.id,
        );
        if (idx !== -1) state.selectedModule.lessons[idx] = payload;
      }
    });

    builder.addCase(adminDeleteLesson.fulfilled, (state, { payload }) => {
      if (state.selectedModule?.lessons) {
        state.selectedModule.lessons = state.selectedModule.lessons.filter(
          (l) => l.id !== payload,
        );
      }
    });

    // ─── Progress ───────────────────────────────────────────────────
    builder
      .addCase(fetchMyLearningProgress.pending, (state) => {
        state.progressStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchMyLearningProgress.fulfilled, (state, { payload }) => {
        state.progressStatus = ASYNC_STATUS.SUCCEEDED;
        state.progress = payload || [];
      })
      .addCase(fetchMyLearningProgress.rejected, (state, { payload }) => {
        state.progressStatus = ASYNC_STATUS.FAILED;
        state.error = payload;
      });

    builder.addCase(markLessonComplete.fulfilled, (state, { payload }) => {
      if (!payload) return;
      const existing = state.progress.findIndex(
        (p) => p.lesson_id === payload.lesson_id,
      );
      if (existing !== -1) {
        state.progress[existing] = payload;
      } else {
        state.progress.push(payload);
      }
    });
  },
});

export const { clearSelectedModule, clearSelectedLesson } =
  learningSlice.actions;

export default learningSlice.reducer;
