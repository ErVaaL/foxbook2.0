import React, { useState } from "react";

const PostBoardHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return (
    <div className="p-4 flex justify-between items-center">
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
