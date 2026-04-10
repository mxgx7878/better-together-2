import { createSlice } from "@reduxjs/toolkit";
import { ASYNC_STATUS } from "../../constants";
import {
  adminFetchEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
  fetchPublicEvents,
  fetchEventById,
  fetchAdminEventById,
} from "../actions/eventActions";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    selectedEvent: null,
    total: 0,
    totalPages: 0,
    page: 1,
    status: ASYNC_STATUS.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(adminFetchEvents.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminFetchEvents.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.events = payload.data;
      state.total = payload.total;
      state.totalPages = payload.totalPages;
      state.page = payload.page;
    });
    builder.addCase(adminFetchEvents.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    builder.addCase(adminCreateEvent.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminCreateEvent.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.events.push(payload);
    });
    builder.addCase(adminCreateEvent.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    builder.addCase(adminUpdateEvent.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminUpdateEvent.fulfilled, (state, { payload }) => {
      const index = state.events.findIndex((event) => event.id === payload.id);
      if (index !== -1) {
        state.events[index] = payload;
      }
      state.status = ASYNC_STATUS.SUCCEEDED;
    });
    builder.addCase(adminUpdateEvent.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });

    builder.addCase(adminDeleteEvent.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(adminDeleteEvent.fulfilled, (state, { payload }) => {
      state.events = state.events.filter((event) => event.id !== payload);
      state.status = ASYNC_STATUS.SUCCEEDED;
    });
    builder.addCase(adminDeleteEvent.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });
    builder.addCase(fetchPublicEvents.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(fetchPublicEvents.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEEDED;
      state.events = payload.data;
      state.total = payload.total;
      state.totalPages = payload.totalPages;
      state.page = payload.page;
    });
    builder.addCase(fetchPublicEvents.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });
    builder.addCase(fetchEventById.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(fetchEventById.fulfilled, (state, action) => {
      state.selectedEvent = action.payload;
      state.status = ASYNC_STATUS.SUCCEEDED;
    });
    builder.addCase(fetchEventById.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });
    builder.addCase(fetchAdminEventById.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });

    builder.addCase(fetchAdminEventById.fulfilled, (state, action) => {
      state.selectedEvent = action.payload;
      state.status = ASYNC_STATUS.SUCCEEDED;
    });
    builder.addCase(fetchAdminEventById.rejected, (state, { payload }) => {
      state.status = ASYNC_STATUS.FAILED;
      state.error = payload;
    });
  },
});

export default eventSlice.reducer;
