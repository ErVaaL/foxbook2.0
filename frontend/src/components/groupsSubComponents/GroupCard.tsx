import React from "react";

interface Group {
  id: string;
  attributes: {
    name: string;
    description: string;
    is_public: boolean;
    created_at: string;
    owner: {
      id: string;
      username: string;
      email: string;
    };
  };
}

const GroupCard: React.FC<{ group: Group }> = React.memo(({ group }) => {
  return (
    <div className="border h-36 border-gray-200 dark:border-gray-700 rounded-md p-2 dark:text-gray-300">
      <h1 className="text-lg font-semibold">{group.attributes.name}</h1>
      <p>Owner: {group.attributes.owner.username}</p>
    </div>
  );
});

export default GroupCard;
