import { create } from "zustand/react";

interface AuthState {
  isLoggedIn: boolean;
  user: string | null;
  token: string | null;
  login: (user: string, token: string) => void;
  logout: () => void;
}

const validateToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const token = sessionStorage.getItem("authToken");
  const isValid = token ? validateToken(token) : false;

  return {
    isLoggedIn: isValid,
    user: isValid ? "User" : null,
    token: isValid ? token : null,
    login: (user: string, token: string) => {
      sessionStorage.setItem("authToken", token);
      set({ isLoggedIn: true, user, token });
    },
    logout: () => {
      sessionStorage.removeItem("authToken");
      set({ isLoggedIn: false, user: null, token: null });
    },
  };
});
