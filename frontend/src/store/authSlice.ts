import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

interface User {
  id: string;
  role: "user" | "admin" | "superadmin";
  email: string;
  username: string;
  avatar?: string;
  friends?: string[];
  notifications?: boolean;
  privacy?: "public" | "private" | "friends_only";
}

interface AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  token: string;
  userId: string | null;
  user: User | null;
}

const storedUser = localStorage.getItem("user");
const parsedUser: User | null = storedUser ? JSON.parse(storedUser) : null;

const initialState: AuthState = {
  isLoggedIn: false,
  isAdmin: parsedUser?.role === "admin" || parsedUser?.role === "superadmin",
  token: "",
  userId: parsedUser?.id || null,
  user: parsedUser,
};

const getUserIdFromToken = (token: string): string | null => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (token: string, { rejectWithValue }) => {
    const userId = getUserIdFromToken(token);
    try {
      if (!userId) throw new Error("Invalid user ID");
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.USER(userId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const userData = response.data.user.data.attributes;
      if (!userData) throw new Error("Invalid user data");
      return {
        id: response.data.user.data.id || "",
        email: userData.email || "",
        role: userData.role || "user",
        username: userData.username || "",
        avatar: userData.avatar || "",
        friends: userData.friends || [],
        notifications: userData.settings?.notifications ?? true,
        privacy: userData.settings?.privacy ?? "private",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || `Failed to fetch user data`,
        );
      }
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      sessionStorage.setItem("authToken", token);
      state.isLoggedIn = true;
      state.isAdmin =
        parsedUser?.role === "admin" || parsedUser?.role === "superadmin";
      state.token = token;
      state.userId = getUserIdFromToken(token);
      state.user = parsedUser;
    },
    logout: (state) => {
      sessionStorage.removeItem("authToken");
      localStorage.removeItem("user");
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.token = "";
      state.userId = null;
      state.user = null;
    },
    validateToken: (state) => {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const isValid = payload.exp * 1000 > Date.now();
          if (isValid) {
            state.isLoggedIn = true;
            state.token = token;
            state.userId = getUserIdFromToken(token);
          } else {
            sessionStorage.removeItem("authToken");
            state.isLoggedIn = false;
            state.token = "";
            state.userId = null;
          }
        } catch {
          sessionStorage.removeItem("authToken");
          state.isLoggedIn = false;
          state.token = "";
          state.userId = null;
        }
      } else {
        state.isLoggedIn = false;
        state.token = "";
        state.userId = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { login, logout, validateToken } = authSlice.actions;

export default authSlice.reducer;
