import React from "react";
import { useNavigate } from "react-router-dom";

type FormattedMember = {
  id: string;
  username: string;
  email: string;
  role: string;
  userId: string;
  joinedDate: string;
};
const MemberCard: React.FC<{ member: FormattedMember }> = React.memo(
  ({ member }) => {
    const navigate = useNavigate();
    return (
      <div className="p-2 rounded-lg w-full border border-gray-400 shadow">
        <div className="flex items-center justify-between">
          <h3
            onClick={() => navigate(`/users/profile/${member.userId}`)}
            className="text-lg font-bold text-black dark:text-white hover:cursor-pointer"
          >
            {member.username}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {member.role}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Email: {member.email}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-300">
          Joined on: {member.joinedDate}
        </p>
      </div>
    );
  },
);

MemberCard.displayName = "MemberCard";
export default MemberCard;
