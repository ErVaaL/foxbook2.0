import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { useCrudOperations } from "../../../hooks/useCrudOperations";

interface UserSettings {
  privacy: "public" | "private" | "friends_only";
  notifications: boolean;
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
  theme: string;
  settings: UserSettings;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

type Action =
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const usersReducer = (state: UsersState, action: Action): UsersState => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload, loading: false, error: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const UsersContext = createContext<any>(null);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { state, editItem, deleteItem } =
    useCrudOperations<User>("/api/admin/users");

  return (
    <UsersContext.Provider value={{ state, editItem, deleteItem }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
