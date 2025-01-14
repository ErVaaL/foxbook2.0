import React from "react";
import GroupsBoardHeader from "./groupsSubComponents/GroupsBoardHeader";
import GroupsBoardBody from "./groupsSubComponents/GroupsBoardBody";

const GroupsBoard: React.FC = () => {
  return (
    <div className="w-full flex-grow">
      <GroupsBoardHeader />
      <div className="relative">
        <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-gray-400 via-gray-500 to-transparent"></span>
      </div>
      <h1 className="text-center w-full m-1 dark:text-gray-300">Public groups:</h1>
      <div className="relative">
        <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-gray-400 via-gray-500 to-transparent"></span>
      </div>
      <GroupsBoardBody />
    </div>
  );
};

export default GroupsBoard;
