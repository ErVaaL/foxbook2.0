import React from "react";
import NavigationButton from "../universal/NavigationButton";

const GroupsBoardHeader: React.FC = () => {
  return (
    <div className="py-3 flex flex-grow">
      <NavigationButton text="Create Group" destination="/create?item=group" />
      <NavigationButton text="Invite friend to group" />
    </div>
  );
};

export default GroupsBoardHeader;
