import React from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  return (
    <div className="border h-36 border-gray-200 dark:border-gray-700 rounded-md p-2 dark:text-gray-300">
      <h1
        onClick={() => navigate(`/groups/${group.id}`)}
        className="text-lg font-semibold"
      >
        {group.attributes.name}{" "}
        {!group.attributes.is_public && (
          <span className="text-sm text-gray-500">(Private)</span>
        )}
      </h1>
      <p>Owner: {group.attributes.owner.username}</p>
    </div>
  );
});

GroupCard.displayName = "GroupCard";
export default GroupCard;
