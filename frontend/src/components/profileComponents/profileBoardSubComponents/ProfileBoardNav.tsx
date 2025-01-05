import React from "react";

type ProfileNavProps = {
  activeSession: string;
  setActiveSession: (section: string) => void;
};

const sections = ["Posts", "Groups", "Friends", "Events", "About"];

const ProfileBoardNav: React.FC<ProfileNavProps> = ({
  activeSession,
  setActiveSession,
}) => {
  return (
    <div className="flex items-center space-x-4">
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => setActiveSession(section)}
          className={`${
            activeSession === section
              ? "bg-orange-500 dark:bg-[#3e3e3e] text-white"
              : "text-gray-500 dark:text-gray-400 hover:bg-orange-400 hover:text-white dark:hover:text-white dark:hover:bg-goldenrodhover"
          } px-4 py-2 rounded`}
        >
          {section}
        </button>
      ))}
    </div>
  );
};

export default ProfileBoardNav;
