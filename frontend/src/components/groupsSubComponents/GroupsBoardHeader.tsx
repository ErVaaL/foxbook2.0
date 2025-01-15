import React from "react";
import { useNavigate } from "react-router-dom";

const GroupsBoardHeader: React.FC = () => {
  const navigate = useNavigate();
  const handleInviteToGroup = () => {
    console.log("Invite To Group");
  };
  const handleCreateGroup = () => {
    navigate("/create?item=group");
  };

  return (
    <div className="w-full h-20 flex justify-center gap-6 py-3">
      <button
        onClick={handleCreateGroup}
        className="w-1/3 h-full text-white bg-orange-400 hover:bg-orange-600 dark:bg-[#2e2e2e] dark:hover:bg-darkgoldenrod transition-colors duration-200"
      >
        Create Group
      </button>
      <button
        onClick={handleInviteToGroup}
        className="w-1/3 h-full text-white bg-orange-400 hover:bg-orange-600 dark:bg-[#2e2e2e] dark:hover:bg-darkgoldenrod transition-colors duration-200"
      >
        Invite friend to group
      </button>
    </div>
  );
};

export default GroupsBoardHeader;
