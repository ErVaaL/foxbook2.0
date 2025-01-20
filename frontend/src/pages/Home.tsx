import React, { useLayoutEffect } from "react";
import PostBoard from "../components/PostBoard";
import { useLocation } from "react-router-dom";

const Home: React.FC = () => {
  const location = useLocation();
  const postId = location.state?.postId || null;

  useLayoutEffect(() => {
    if (!postId) return;

    setTimeout(() => {
      const postElement = document.getElementById(`post-${postId}`);
      if (!postElement) return;
      postElement.scrollIntoView({ behavior: "smooth", block: "center" });
      postElement.classList.add("border-2", "border-blue-500");
      setTimeout(() => {
        postElement.classList.remove("border-2", "border-blue-500");
      }, 2000);
    }, 500);
  }, [postId]);

  return (
    <div className="max-w-5xl mx-auto p-0 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      <PostBoard />
    </div>
  );
};

export default Home;
