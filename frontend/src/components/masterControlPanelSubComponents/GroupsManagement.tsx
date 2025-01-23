import React from "react";
import { useGroups } from "../../contexts/masterControlContext/subMasterContext/MasterGroupsContext";
import GroupsTable from "./tables/GroupsTable";
import Loader from "../Loader";

const GroupsManagement: React.FC = () => {
  const { state, editItem, deleteItem } = useGroups();
  const { data: groups, loading, error } = state;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center py-2">
        Manage Groups
      </h2>

      {loading && <Loader size={60} />}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && groups.length > 0 && (
        <GroupsTable
          data={groups}
          editItem={editItem}
          deleteItem={deleteItem}
        />
      )}

      {!loading && !error && groups.length === 0 && (
        <p className="text-gray-600">No groups found</p>
      )}
    </div>
  );
};

export default GroupsManagement;
