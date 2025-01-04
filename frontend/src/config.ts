export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/users/register",
  LOGOUT: "/logout",
  PROFILE: (userId: string) => `/users/${userId}/profile`,
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
