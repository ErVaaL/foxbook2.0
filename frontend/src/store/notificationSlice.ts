import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import { Subscription } from "@rails/actioncable";
import { RootState, AppDispatch } from "../store";
import cable from "../utils/actionCable";

export interface Notification {
  id: string;
  type: string;
  attributes: {
    user_id: string;
    was_seen: boolean;
    created_at: string;
    content: Record<string, unknown>;
  };
}

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  subscription: Subscription | null;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  subscription: null,
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
  async (
    { id, token }: { id: string; token: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      dispatch(markAsSeen(id));

      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.USER_NOTIFICATIONS}/${id}/switch_read_status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return response.data.notification;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error)
          ? error.response?.data.message
          : "Failed to update notification status",
      );
    }
  },
);

let notificationSubscription: Subscription | null = null;

export const subscribeToNotifications =
  (userId: string) => (dispatch: AppDispatch) => {
    if (!cable || notificationSubscription) return;

    console.log(`📡 Subscribing to notifications for user: ${userId}`);

    notificationSubscription = cable.subscriptions.create(
      { channel: "NotificationChannel", user_id: userId },
      {
        connected() {
          console.log("✅ Connected to NotificationChannel!");
        },
        disconnected() {
          console.log("❌ Disconnected from NotificationChannel!");
        },
        received(rawData: Notification) {
          console.log("📨 Received WebSocket notification:", rawData);
          dispatch(receiveNotification(rawData));
        },
      },
    ) as Subscription;

    dispatch(
      setSubscription({ identifier: notificationSubscription.identifier }),
    );
  };

export const initializeNotifications =
  (token: string, userId: string) => (dispatch: AppDispatch) => {
    dispatch(fetchNotifications(token));
    dispatch(subscribeToNotifications(userId));
  };

export const updateNotificationContent = createAsyncThunk(
  "notifications/updateNotificationContent",
  async (
    { id, content }: { id: string; content: Record<string, unknown> },
    { dispatch, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) throw new Error("Unauthorized");

      await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.USER_NOTIFICATIONS}/${id}`,
        content,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      dispatch(markAsSeen(id));
      return { id, content };
    } catch (error) {
      console.error("Error updating notification content", error);
    }
  },
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    receiveNotification(state, action) {
      const exists = state.notifications.some(
        (n) => n.id === action.payload.id,
      );
      if (!exists) state.notifications.unshift(action.payload);
    },
    markAsSeen(state, action) {
      const id = action.payload;
      const notification = state.notifications.find((n) => n.id === id);
      if (notification) notification.attributes.was_seen = true;
    },
    setSubscription(state, action) {
      state.subscription = action.payload.identifier;
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

export const { receiveNotification, markAsSeen, setSubscription } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
