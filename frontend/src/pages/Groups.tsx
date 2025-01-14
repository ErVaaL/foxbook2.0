import React from "react";
import GroupsBoard from "../components/GroupsBoard";

const Groups: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-0 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      <GroupsBoard />
    </div>
  );
};

export default Groups;
