import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import eventReducer from "./slices/eventSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    event: eventReducer,
  },
});

export default store;
