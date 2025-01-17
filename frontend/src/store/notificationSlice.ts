import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

interface Notification {
  id: string;
  type: string;
  attributes: {
    was_seen: boolean;
    created_at: string;
    content: Record<string, unknown>;
  };
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
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.USER_NOTIFICATIONS}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.data || !response.data.notifications.data)
        throw new Error("Error fetching user notifications");
      return response.data.notifications.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to fetch notifications",
        );
      }
    }
  },
);
export const toggleNotificationSeen = createAsyncThunk(
  "notifications/toggleNotificationSeen",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.USER_NOTIFICATIONS}/${id}/switch_read_status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.notification;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to update notification status",
        );
      }
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
      if (notification) notification.attributes.was_seen = true;
    },
    updateNotificationContent(state, action) {
      const { id, content } = action.payload;
      const notification = state.notifications.find((n) => n.id === id);
      if (notification) {
        notification.attributes.content = {
          ...notification.attributes.content,
          ...content,
        };
      }
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
        state.notifications = (action.payload as Notification[]).map(
          (notification) => ({
            ...notification,
            attributes: {
              ...notification.attributes,
              content: {
                ...notification.attributes.content,
                action_taken:
                  notification.attributes.content.action_taken || false,
              },
            },
          }),
        );
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleNotificationSeen.fulfilled, (state, action) => {
        if (!action.payload || !action.payload.data) {
          console.error("Invalid notification data:", action.payload);
          return;
        }
        const updatedNotification = action.payload.data.attributes;
        const notifiationId = action.payload.data.id;
        const notificationIndex = state.notifications.findIndex(
          (n) => n.id === notifiationId,
        );
        if (notificationIndex !== -1) {
          state.notifications[notificationIndex].attributes.was_seen =
            updatedNotification.was_seen;
        }
      });
  },
});

export const { markAsSeen, updateNotificationContent } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
