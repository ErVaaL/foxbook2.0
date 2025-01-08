import React, { useState } from "react";

const PostBoardHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [groups, setGroups] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return (
    <div className="p-4 flex justify-between items-center gap-3">
      <h2 className="dark:text-gray-300 p-2">Choose filter:</h2>
      <select className="dark:bg-gray-600 rounded-lg p-2 dark:text-gray-300">
        <option value="all">All</option>
        <option value="friends">Friends</option>
        <option value="groups">Groups</option>
        <option value="events">Events</option>
      </select>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search friends, groups, or events..."
        className="w-full p-2 border border-gray-300 rounded dark:bg-gray-600 dark:text-gray-100"
      />
    </div>
  );
};

export default PostBoardHeader;
