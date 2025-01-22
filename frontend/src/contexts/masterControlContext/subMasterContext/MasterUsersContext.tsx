import React, { createContext, useContext, ReactNode } from "react";
import { useCrudOperations } from "../../../hooks/useCrudOperations";
import { API_BASE_URL, API_ENDPOINTS } from "../../../config";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface UserSettings {
  privacy: "public" | "private" | "friends_only";
  notifications: boolean;
  theme: "light" | "dark";
}

export interface User {
  id: string;
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
}

interface UsersState {
  data: User[];
  loading: boolean;
  error: string | null;
}

interface UsersContextType {
  state: UsersState;
  editItem: (id: string, updatedData: Partial<User>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

const MasterUsersContext = createContext<UsersContextType | undefined>(
  undefined,
);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);
  console.log("token", token);

  const { state, editItem, deleteItem } = useCrudOperations<User>(
    `${API_BASE_URL}${API_ENDPOINTS.ADMIN_USERS}`,
    token,
  );

  return (
    <MasterUsersContext.Provider value={{ state, editItem, deleteItem }}>
      {children}
    </MasterUsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(MasterUsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};
