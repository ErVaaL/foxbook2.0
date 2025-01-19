import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import { RootState } from "../store";

interface SettingsState {
  theme: "light" | "dark";
  notifications: boolean;
  privacy: "public" | "private" | "friends_only";
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  theme: "light",
  notifications: true,
  privacy: "private",
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { userId, token } = state.auth;

      if (!userId || !token) throw new Error("User not authenticated");

      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.USER_SETTINGS(userId)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response.data || !response.data.settings) {
        throw new Error("Invalid settings data received");
      }

      return response.data.settings.data.attributes;
    } catch (error) {
      console.error("❌ fetchSettings error:", error);
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data
          ? error.response.data.message
          : "Failed to fetch settings",
      );
    }
  },
);

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (
    updatedSettings: Partial<SettingsState>,
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const { userId, token } = state.auth;

      if (!userId || !token) throw new Error("User not authenticated");

      const { theme, notifications, privacy } = updatedSettings;

      const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.USER_SETTINGS(userId)}`,
        { settings: { theme, notifications, privacy } },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response.data || !response.data.settings) {
        throw new Error("Invalid settings data received");
      }

      return response.data.settings.data.attributes;
    } catch (error) {
      console.error("❌ updateSettings error:", error);
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data
          ? error.response.data.message
          : "Failed to update settings",
      );
    }
  },
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSettings: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSettings.fulfilled,
        (state, action: PayloadAction<SettingsState>) => {
          state.loading = false;
          Object.assign(state, action.payload);
        },
      )
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateSettings.fulfilled,
        (state, action: PayloadAction<SettingsState>) => {
          state.loading = false;
          Object.assign(state, action.payload);
        },
      )
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
