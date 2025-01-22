export interface AdminUserFromAPI {
  id: string;
  attributes: {
    role: "user" | "admin" | "superadmin";
    first_name: string;
    last_name: string;
    username: string;
    birthday: string | null;
    email: string;
    phone: string;
    avatar?: string;
    friends: string[];
    friend_requests_sent: string[];
    friend_requests_received: string[];
    password_digest?: string;
    settings: UserSettings;
  };
}

export interface UserSettings {
  theme: boolean;
  notifications: boolean;
  privacy: "public" | "private" | "friends_only";
}
