import React, { createContext, useContext, ReactNode } from "react";
import { useCrudOperations } from "../../../hooks/useCrudOperations";
import { API_BASE_URL, API_ENDPOINTS } from "../../../config";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface OwnerDetails {
  id: string;
  username: string;
  email: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  created_at: string;
  owner: OwnerDetails;
}

interface GroupsState {
  data: Group[];
  loading: boolean;
  error: string | null;
}

interface GroupsContextType {
  state: GroupsState;
  editItem: (id: string, updatedData: Partial<Group>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

const MasterGroupsContext = createContext<GroupsContextType | undefined>(
  undefined,
);

export const GroupsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);

  const { state, editItem, deleteItem } = useCrudOperations<Group>(
    `${API_BASE_URL}${API_ENDPOINTS.ADMIN_GROUPS}`,
    token,
    "groups",
  );

  return (
    <MasterGroupsContext.Provider value={{ state, editItem, deleteItem }}>
      {children}
    </MasterGroupsContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(MasterGroupsContext);
  if (!context) {
    throw new Error("useGroups must be used within a GroupsProvider");
  }
  return context;
};
