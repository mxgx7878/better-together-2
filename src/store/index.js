import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import eventReducer from "./slices/eventSlice";
import categoryReducer from "./slices/categorySlice";
import userReducer from "./slices/userSlice";
import learningReducer from "./slices/learningSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import documentReducer from "./slices/documentSlice";
import serviceRequestReducer from "./slices/serviceRequestSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    event: eventReducer,
    category: categoryReducer,
    user: userReducer,
    learning: learningReducer,
    subscription: subscriptionReducer,
    document: documentReducer,
    serviceRequest: serviceRequestReducer,
  },
});

export default store;
