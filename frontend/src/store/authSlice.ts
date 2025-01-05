import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  userId: null,
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      sessionStorage.setItem("authToken", token);
      state.isLoggedIn = true;
      state.token = token;
      state.userId = getUserIdFromToken(token);
    },
    logout: (state) => {
      sessionStorage.removeItem("authToken");
      state.isLoggedIn = false;
      state.token = null;
      state.userId = null;
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
            state.token = null;
            state.userId = null;
          }
        } catch {
          sessionStorage.removeItem("authToken");
          state.isLoggedIn = false;
          state.token = null;
          state.userId = null;
        }
      } else {
        state.isLoggedIn = false;
        state.token = null;
        state.userId = null;
      }
    },
  },
});

export const { login, logout, validateToken } = authSlice.actions;

export default authSlice.reducer;
