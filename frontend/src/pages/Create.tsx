import React from "react";
import { useSearchParams } from "react-router-dom";
import CreateHeader from "../components/createSubComponents/CreateHeader";
import CreateBody from "../components/createSubComponents/CreateBody";

const Create: React.FC = () => {
  const [searchParams] = useSearchParams();
  const itemType = searchParams.get("item");

  return (
    <div className="max-w-5xl mx-auto p-0 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      <CreateHeader />
      <div className="relative">
        <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-gray-400 via-gray-500 to-transparent"></span>
      </div>
      <CreateBody itemType={itemType} />
    </div>
  );
};

export default Create;
