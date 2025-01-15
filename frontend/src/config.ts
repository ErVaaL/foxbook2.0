export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/users/register",
  LOGOUT: "/logout",
  USERS: "/users",
  PROFILE: (profileUserId: string) => `/users/${profileUserId}/profile`,
  FRIENDS: (userId: string) => `/users/${userId}/friends`,
  FRIEND_REQUESTS_SENT: (userId: string) =>
    `/users/${userId}/friends/sent_friend_requests`,
  FRIEND_REQUESTS_RECEIVED: (userId: string) =>
    `/users/${userId}/friends/recieved_friend_requests`,
  FRIEND_REQUEST_ACTION: (friendId: string) => `/friends/${friendId}`,
  USER_EDIT: (userId: string) => `/users/${userId}`,
  USER_POSTS: (userId: string) => `/users/${userId}/posts`,
  USER_GROUPS: (userId: string) => `/users/${userId}/groups`,
  USER_EVENTS: (userId: string) => `/users/${userId}/events`,
  USER_NOTIFICATIONS: "/notifications",
  USER_SENT_REQUESTS: (userId: string) =>
    `/users/${userId}/friends/sent_friend_requests`,
  USER_FRIENDS: (userId: string) => `/users/${userId}/friends`,
  SEND_FRIEND_REQUEST: "/friends",
  POSTS: "/posts",
  GROUPS: "/groups",
  GROUP_POSTS: (groupId: string) => `/groups/${groupId}/member_posts`,
  GROUP_EVENTS: (groupId: string) => `/groups/${groupId}/member_events`,
  GROUP_MEMBERS: (groupId: string) => `/groups/${groupId}/members`,
  EVENTS: "/events",
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
