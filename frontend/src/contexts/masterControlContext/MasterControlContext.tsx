import React from "react";
import { UsersProvider } from "./subMasterContext/MasterUsersContext";

export const MasterControlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <UsersProvider>{children}</UsersProvider>;
};
