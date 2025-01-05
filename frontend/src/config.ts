export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/users/register",
  LOGOUT: "/logout",
  USERS: "/users",
  USER_EDIT: (userId: string) => `/users/${userId}`,
  PROFILE: (profileUserId: string) => `/users/${profileUserId}/profile`,
  FRIENDS: (userId: string) => `/users/${userId}/friends`,
  FRIEND_REQUESTS_SENT: (userId: string) => `/users/${userId}/friends/sent_friend_requests`,
  FRIEND_REQUESTS_RECEIVED: (userId: string) => `/users/${userId}/friends/recieved_friend_requests`,
  USER_POSTS: (userId: string) => `/users/${userId}/posts`,
  USER_GROUPS: (userId: string) => `/users/${userId}/groups`,
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
