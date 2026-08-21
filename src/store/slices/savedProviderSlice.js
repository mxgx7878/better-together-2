import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  fetchSavedProviders,
  saveProvider,
  unsaveProvider,
} from "../actions/savedProviderActions";

const savedProviderSlice = createSlice({
  name: "savedProvider",
  initialState: {
    list: [],       // full provider objects (for the Saved Providers page)
    savedIds: [],   // ids only (for bookmark state on directory / applications)
    status: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedProviders.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchSavedProviders.fulfilled, (state, { payload }) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.list = payload || [];
        state.savedIds = (payload || []).map((p) => p.id);
      })
      .addCase(fetchSavedProviders.rejected, (state, { payload }) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = payload;
      })
      // Optimistic-ish: update ids immediately on success.
      .addCase(saveProvider.fulfilled, (state, { payload }) => {
        if (!state.savedIds.includes(payload.providerId)) {
          state.savedIds.push(payload.providerId);
        }
      })
      .addCase(unsaveProvider.fulfilled, (state, { payload }) => {
        state.savedIds = state.savedIds.filter(
          (id) => id !== payload.providerId,
        );
        state.list = state.list.filter((p) => p.id !== payload.providerId);
      });
  },
});

export default savedProviderSlice.reducer;