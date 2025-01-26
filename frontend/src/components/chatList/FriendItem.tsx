import React from "react";
import { Friend } from "./ChatList";

type FriendItemProps = {
  friend: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    avatar: string;
  };
  onClick: (friend: Friend) => void;
};

const FriendItem: React.FC<FriendItemProps> = ({ friend, onClick }) => {
  return (
    <div
      onClick={() => onClick(friend)}
      className="flex flex-grow rounded-lg w-full items-center text-center p-2 hover:bg-orange-400 dark:hover:bg-darkgoldenrod "
    >
      <img
        src={friend.avatar}
        alt={friend.username}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex flex-col ml-2">
        <span className="font-semibold">@{friend.username}</span>
        <span className="text-sm">{`${friend.first_name} ${friend.last_name}`}</span>
      </div>
    </div>
  );
};

export default FriendItem;
