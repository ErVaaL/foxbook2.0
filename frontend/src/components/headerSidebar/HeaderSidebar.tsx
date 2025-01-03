import React from "react";
import { FaHome, FaCog, FaUser, FaUsers, FaComments } from "react-icons/fa";
import styles from "./HeaderSidebar.module.css";

const HeaderSidebar: React.FC = () => {
  return (
    <aside
      id="headerSidebar"
      className={`${styles.headerSidebar}h-full w-24 flex flex-col items-center py-4`}
    >
      <div className="flex-grow text-2xl items-center font-bold mb-3">Logo</div>
      <nav className="flex flex-col items-center space-y-6">
        <button className="hover:text-white">
          <FaHome size={24} />
        </button>
        <button className="hover:text-white">
          <FaUsers size={24} />
        </button>
        <button className="hover:text-white">
          <FaComments size={24} />
        </button>
      </nav>
      <div className="flex-grow h-full"></div>
      <div className="flex flex-col space-y-6 items-center h-min">
        <button className="hover:text-white">
          <FaCog size={24} />
        </button>
        <button className="hover:text-white">
          <FaUser size={24} />
        </button>
      </div>
    </aside>
  );
};

export default HeaderSidebar;
