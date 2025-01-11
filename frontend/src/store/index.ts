import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import notificationsReducer from "./notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
