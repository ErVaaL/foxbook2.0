import React from "react";
import PostBoardHeader from "./postBoardSubComponents/PostBoardHeader";
import PostBoardContents from "./postBoardSubComponents/PostBoardContents";

const PostBoard: React.FC = () => {
  return (
    <div className="w-full flex-grow">
      <PostBoardHeader />
      <div className="relative h-12">
        <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-gray-400 via-gray-500 to-transparent"></span>
      </div>
      <PostBoardContents />
    </div>
  );
};

export default PostBoard;
