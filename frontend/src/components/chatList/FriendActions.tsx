import React from "react";
import { useNavigate } from "react-router-dom";

type FriendActionsProps = {
  friend: {
    id: string;
    username: string;
  };
  onClose: () => void;
  onOpenChat: () => void;
  position: {
    top: number;
    left: number;
  };
};

const FriendActions: React.FC<FriendActionsProps> = ({
  friend,
  onClose,
  onOpenChat,
  position,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="absolute bg-white dark:bg-[#2a2a2a] dark:text-gray-300 shadow-lg rounded-lg p-2"
      style={{
        top: position.top + 5,
        left: position.left - 125,
      }}
      onClick={onClose}
    >
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
          navigate(`/users/profile/${friend.id}`);
        }}
      >
        Visit Profile
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          onOpenChat();
        }}
      >
        Open Chat
      </button>
    </div>
  );
};

export default FriendActions;
