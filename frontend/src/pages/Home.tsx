import React from "react";
import PostBoard from "../components/PostBoard";

const Home: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-0 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      <PostBoard />
    </div>
  );
};

export default Home;
