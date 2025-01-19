import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import notificationsReducer from "./notificationSlice";
import settingsReducer from "./settingsSlice";
import postsReducer from "./postSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
    settings: settingsReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
