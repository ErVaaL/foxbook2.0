import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CreateHeader: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemType = searchParams.get("item");

  const handleNavigation = (type: string) => {
    navigate(`/create?item=${type}`);
  };

  return (
    <div className="flex justify-around p-4">
      <button
        onClick={() => handleNavigation("posts")}
        className={`px-4 py-2 rounded ${
          itemType === "posts"
            ? "bg-orange-500 dark:bg-darkgoldenrod text-white"
            : "bg-gray-100 dark:bg-gray-400 dark:text-gray-100 hover:bg-orange-600 dark:hover:bg-goldenrodhover"
        }`}
      >
        Post
      </button>
      <button
        onClick={() => handleNavigation("group")}
        className={`px-4 py-2 rounded ${
          itemType === "group"
            ? "bg-orange-500 dark:bg-darkgoldenrod text-white"
            : "bg-gray-100 dark:bg-gray-400 dark:text-gray-100 hover:bg-orange-600 dark:hover:bg-goldenrodhover"
        }`}
      >
        Group
      </button>
      <button
        onClick={() => handleNavigation("event")}
        className={`px-4 py-2 rounded ${
          itemType === "event"
            ? "bg-orange-500 dark:bg-darkgoldenrod text-white"
            : "bg-gray-100 dark:bg-gray-400 dark:text-gray-100 hover:bg-orange-600 dark:hover:bg-goldenrodhover"
        }`}
      >
        Event
      </button>
    </div>
  );
};

export default CreateHeader;
