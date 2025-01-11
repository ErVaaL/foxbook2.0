import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

interface Notification {
  id: string;
  type: string;
  was_seen: boolean;
  created_at: string;
  content: Record<string, any>;
}

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.USER_NOTIFICATIONS}`,
      );
      if (!response.data) throw new Error("Error fetching user notifications");
      return response.data.notifications;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAsSeen(state, action) {
      const id = action.payload;
      const notification = state.notifications.find((n) => n.id === id);
      if (notification) notification.was_seen = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { markAsSeen } = notificationsSlice.actions;
export default notificationsSlice.reducer;
