import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import { adminFetchFeatures } from "../actions/featuresActions";

// Read-only slice. Admin pages fetch features and pass their ids
// when saving subscriptions; there is no create/update/delete from
// the frontend.

const featureSlice = createSlice({
  name: "feature",
  initialState: {
    features: [],
    status: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminFetchFeatures.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(adminFetchFeatures.fulfilled, (state, { payload }) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.features = payload?.data || [];
      })
      .addCase(adminFetchFeatures.rejected, (state, { payload }) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = payload;
      });
  },
});

export default featureSlice.reducer;