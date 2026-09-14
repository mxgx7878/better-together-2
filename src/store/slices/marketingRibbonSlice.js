import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import { fetchMarketingRibbon } from "../actions/marketingRibbonActions";

const marketingRibbonSlice = createSlice({
  name: "marketingRibbon",
  initialState: {
    entries: [],
    status: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketingRibbon.pending, (s) => {
        s.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchMarketingRibbon.fulfilled, (s, { payload }) => {
        s.status = ASYNC_STATUS.SUCCEEDED;
        s.entries = payload || [];
      })
      .addCase(fetchMarketingRibbon.rejected, (s, { payload }) => {
        s.status = ASYNC_STATUS.FAILED;
        s.error = payload;
      });
  },
});

export default marketingRibbonSlice.reducer;