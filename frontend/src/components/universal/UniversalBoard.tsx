import React, { useState } from "react";

type UniversalBoardProps = {
  sections: Array<{
    label: string;
    component: React.ReactNode;
  }>;
};

const UniversalBoard: React.FC<UniversalBoardProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0].label);

  return (
    <div className="flex-grow">
      <div className="relative w-full h-12">
        <span className="absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-gray-400 via-gray-500 to-transparent"></span>
      </div>
      <div className="flex justify-center items-center space-x-4">
        {sections.map((section) => (
          <button
            key={section.label}
            onClick={() => setActiveSection(section.label)}
            className={`px-4 py-2 rounded ${
              activeSection === section.label
                ? "bg-blue-500 text-white dark:bg-blue-600"
                : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
      <div className="relative w-full h-12">
        <span className="absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-gray-400 via-gray-500 to-transparent"></span>
      </div>
      <div className="mt-4">
        {sections.find((section) => section.label === activeSection)?.component}
      </div>
    </div>
  );
};

export default UniversalBoard;
