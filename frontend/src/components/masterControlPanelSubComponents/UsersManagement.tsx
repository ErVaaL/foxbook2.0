import React from "react";
import { useUsers } from "../../contexts/masterControlContext/subMasterContext/MasterUsersContext";
import UserTable from "./tables/UserTable";
const UsersManagement: React.FC = () => {
  const { state, editItem, deleteItem } = useUsers();
  const { data: users, loading, error } = state;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center py-2">
        Manage Users
      </h2>

      {loading && <p className="text-blue-500">Loading users...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && users.length > 0 && (
        <UserTable data={users} editItem={editItem} deleteItem={deleteItem} />
      )}

      {!loading && !error && users.length === 0 && (
        <p className="text-gray-600">No users found.</p>
      )}
    </div>
  );
};

export default UsersManagement;
