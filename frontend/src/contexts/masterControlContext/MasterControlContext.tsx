import React from "react";
import { UsersProvider } from "./subMasterContext/MasterUsersContext";
import { GroupsProvider } from "./subMasterContext/MasterGroupsContext";
import { EventsProvider } from "./subMasterContext/MasterEventsContext";

export const MasterControlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <UsersProvider>
      <GroupsProvider>
        <EventsProvider>{children}</EventsProvider>
      </GroupsProvider>
    </UsersProvider>
  );
};
