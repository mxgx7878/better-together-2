import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchForumQuestions,
  fetchForumQuestion,
  createForumQuestion,
  createForumAnswer,
  deleteForumQuestion,
  deleteForumAnswer,
  adminFetchForumQuestions,
  adminToggleForumPin,
  adminUpdateForumStatus,
  adminDeleteForumQuestion,
  adminDeleteForumAnswer,
} from "../actions/forumActions";

const initialState = {
  list: [],
  total: 0,
  status: ASYNC_STATUS.IDLE,

  selected: null,
  selectedStatus: ASYNC_STATUS.IDLE,

  saveStatus: ASYNC_STATUS.IDLE,   // creating a question
  replyStatus: ASYNC_STATUS.IDLE,  // creating an answer

  error: null,
};

// Merge an updated question into both the list and the open detail view.
const patchInList = (state, updated) => {
  if (!updated?.id) return;
  const idx = state.list.findIndex((q) => q.id === updated.id);
  if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
  if (state.selected?.id === updated.id) {
    state.selected = { ...state.selected, ...updated };
  }
};

const forumSlice = createSlice({
  name: "forum",
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
      state.selectedStatus = ASYNC_STATUS.IDLE;
    },
    clearSaveStatus(state) {
      state.saveStatus = ASYNC_STATUS.IDLE;
      state.replyStatus = ASYNC_STATUS.IDLE;
    },
  },
  extraReducers: (builder) => {
    // ─── List ─────────────────────────────────────────────
    builder
      .addCase(fetchForumQuestions.pending, (s) => {
        s.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchForumQuestions.fulfilled, (s, { payload }) => {
        s.status = ASYNC_STATUS.SUCCEEDED;
        s.list = payload?.data || payload || [];
        s.total = payload?.total ?? s.list.length;
      })
      .addCase(fetchForumQuestions.rejected, (s, { payload }) => {
        s.status = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Single (with answers) ────────────────────────────
    builder
      .addCase(fetchForumQuestion.pending, (s) => {
        s.selectedStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchForumQuestion.fulfilled, (s, { payload }) => {
        s.selectedStatus = ASYNC_STATUS.SUCCEEDED;
        s.selected = payload;
      })
      .addCase(fetchForumQuestion.rejected, (s, { payload }) => {
        s.selectedStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Create question ──────────────────────────────────
    builder
      .addCase(createForumQuestion.pending, (s) => {
        s.saveStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(createForumQuestion.fulfilled, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.SUCCEEDED;
        if (payload?.id) {
          // keep pinned items on top
          const firstUnpinned = s.list.findIndex((q) => !q.is_pinned);
          if (firstUnpinned === -1) s.list.push(payload);
          else s.list.splice(firstUnpinned, 0, payload);
          s.total += 1;
        }
      })
      .addCase(createForumQuestion.rejected, (s, { payload }) => {
        s.saveStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Create answer ────────────────────────────────────
    builder
      .addCase(createForumAnswer.pending, (s) => {
        s.replyStatus = ASYNC_STATUS.LOADING;
      })
      .addCase(createForumAnswer.fulfilled, (s, { payload }) => {
        s.replyStatus = ASYNC_STATUS.SUCCEEDED;
        const { questionId, answer } = payload;
        // append to open detail
        if (s.selected?.id === questionId) {
          s.selected.answers = [...(s.selected.answers || []), answer];
          s.selected.answers_count = (s.selected.answers_count || 0) + 1;
        }
        // bump count in the list
        const idx = s.list.findIndex((q) => q.id === questionId);
        if (idx !== -1) {
          s.list[idx].answers_count = (s.list[idx].answers_count || 0) + 1;
        }
      })
      .addCase(createForumAnswer.rejected, (s, { payload }) => {
        s.replyStatus = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Delete question (own) ────────────────────────────
    builder.addCase(deleteForumQuestion.fulfilled, (s, { payload: id }) => {
      s.list = s.list.filter((q) => q.id !== id);
      s.total = Math.max(0, s.total - 1);
      if (s.selected?.id === id) s.selected = null;
    });

    // ─── Delete answer (own) ──────────────────────────────
    builder.addCase(deleteForumAnswer.fulfilled, (s, { payload }) => {
      const { questionId, answerId } = payload;
      if (s.selected?.id === questionId && s.selected.answers) {
        s.selected.answers = s.selected.answers.filter((a) => a.id !== answerId);
        s.selected.answers_count = Math.max(
          0,
          (s.selected.answers_count || 1) - 1,
        );
      }
      const idx = s.list.findIndex((q) => q.id === questionId);
      if (idx !== -1) {
        s.list[idx].answers_count = Math.max(
          0,
          (s.list[idx].answers_count || 1) - 1,
        );
      }
    });

    // ─── Admin list ───────────────────────────────────────
    builder
      .addCase(adminFetchForumQuestions.pending, (s) => {
        s.status = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchForumQuestions.fulfilled, (s, { payload }) => {
        s.status = ASYNC_STATUS.SUCCEEDED;
        s.list = payload?.data || payload || [];
        s.total = payload?.total ?? s.list.length;
      })
      .addCase(adminFetchForumQuestions.rejected, (s, { payload }) => {
        s.status = ASYNC_STATUS.FAILED;
        s.error = payload;
      });

    // ─── Admin pin / status ───────────────────────────────
    builder.addCase(adminToggleForumPin.fulfilled, (s, { payload }) => {
      patchInList(s, payload);
    });
    builder.addCase(adminUpdateForumStatus.fulfilled, (s, { payload }) => {
      patchInList(s, payload);
    });

    // ─── Admin delete ─────────────────────────────────────
    builder.addCase(adminDeleteForumQuestion.fulfilled, (s, { payload: id }) => {
      s.list = s.list.filter((q) => q.id !== id);
      s.total = Math.max(0, s.total - 1);
      if (s.selected?.id === id) s.selected = null;
    });
    builder.addCase(adminDeleteForumAnswer.fulfilled, (s, { payload }) => {
      const { questionId, answerId } = payload;
      if (s.selected?.id === questionId && s.selected.answers) {
        s.selected.answers = s.selected.answers.filter((a) => a.id !== answerId);
      }
    });
  },
});

export const { clearSelected, clearSaveStatus } = forumSlice.actions;
export default forumSlice.reducer;