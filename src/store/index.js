import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import eventReducer from "./slices/eventSlice";
import categoryReducer from "./slices/categorySlice";
import userReducer from "./slices/userSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    event: eventReducer,
    category: categoryReducer,
    user: userReducer,
  },
});

export default store;
