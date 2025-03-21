export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/users/register",
  LOGOUT: "/auth/logout",
  USERS: "/users",
  PROFILE: (profileUserId: string) => `/users/${profileUserId}/profile`,
  FRIENDS: (userId: string) => `/users/${userId}/friends`,
  FRIEND_REQUESTS_SENT: (userId: string) =>
    `/users/${userId}/friends/sent_friend_requests`,
  FRIEND_REQUESTS_RECEIVED: (userId: string) =>
    `/users/${userId}/friends/recieved_friend_requests`,
  FRIEND_REQUEST_ACTION: (friendId: string) => `/friends/${friendId}`,
  USER: (userId: string) => `/users/${userId}`,
  USER_SETTINGS: (userId: string) => `/users/${userId}/settings`,
  USER_POSTS: (userId: string) => `/users/${userId}/posts`,
  USER_GROUPS: (userId: string) => `/users/${userId}/groups`,
  USER_EVENTS: (userId: string) => `/users/${userId}/events`,
  USER_NOTIFICATIONS: "/notifications",
  USER_SENT_REQUESTS: (userId: string) =>
    `/users/${userId}/friends/sent_friend_requests`,
  USER_FRIENDS: (userId: string) => `/users/${userId}/friends`,
  SEND_FRIEND_REQUEST: "/friends",
  POSTS: "/posts",
  POST: (postId: string) => `/posts/${postId}`,
  POST_COMMENTS: (postId: string) => `/posts/${postId}/comments`,
  POST_LIKES: (postId: string) => `/posts/${postId}/likes`,
  GROUPS: "/groups",
  GROUP_POSTS: (groupId: string) => `/groups/${groupId}/member_posts`,
  GROUP_EVENTS: (groupId: string) => `/groups/${groupId}/member_events`,
  GROUP_MEMBERS: (groupId: string) => `/groups/${groupId}/members`,
  GROUP_IS_MEMBER: (groupId: string) => `/groups/${groupId}/is_member`,
  GROUP_JOIN: (groupId: string) => `/groups/${groupId}/add_member`,
  GROUP_LEAVE: (groupId: string, userId: string) =>
    `/groups/${groupId}/members/${userId}`,
  EVENTS: "/events",
  EVENT: (eventId: string) => `/events/${eventId}`,
  EVENT_ATTEND: (eventId: string) => `/events/${eventId}/attendees`,
  EVENT_UNATTEND: (eventId: string, userId: string) =>
    `/events/${eventId}/attendees/${userId}`,
  ADMIN_USERS: "/admin/users",
  ADMIN_GROUPS: "/admin/groups",
  ADMIN_CONTENT: "/admin/content",
  CREATE_REPORT: "/reports",
  REPORTS: "/admin/reports",
  REPORTS_CLOSE: (reportId: string) => `/admin/reports/${reportId}/close`,
  MESSAGE_EDIT: (messageId: string) => `/messages/${messageId}`,
  CONVERSATIONS: (userId: string) => `/conversation/${userId}`,
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_MESSAGES_BASE_URL = import.meta.env.VITE_API_MESSAGES_BASE_URL;
