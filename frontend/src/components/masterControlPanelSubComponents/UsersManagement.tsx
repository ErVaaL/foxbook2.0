import React from "react";
import { useUsers } from "../../contexts/masterControlContext/subMasterContext/MasterUsersContext";
import UserTable from "./tables/UserTable";
import Loader from "../Loader";
const UsersManagement: React.FC = () => {
  const { state, editItem, deleteItem } = useUsers();
  const { data: users, loading, error } = state;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center py-2">
        Manage Users
      </h2>

      {loading && <Loader size={60} />}

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
