import React from "react";
import { UsersProvider } from "./subMasterContext/MasterUsersContext";
import { GroupsProvider } from "./subMasterContext/MasterGroupsContext";

export const MasterControlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <UsersProvider>
      <GroupsProvider>{children}</GroupsProvider>
    </UsersProvider>
  );
};
