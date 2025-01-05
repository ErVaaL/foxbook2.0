export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/users/register",
  LOGOUT: "/logout",
  USERS: "/users",
  USER_EDIT: (userId: string) => `/users/${userId}`,
  PROFILE: (profileUserId: string) => `/users/${profileUserId}/profile`,
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
