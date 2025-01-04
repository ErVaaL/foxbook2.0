import React from "react";
import { FaHome, FaCog, FaUser, FaUsers, FaComments } from "react-icons/fa";
import "./HeaderSidebar.module.css";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../features/auth/useAuthStore";
import ThemeSwitcher from "./ThemeSwitcher";

const HeaderSidebar: React.FC = () => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  const noButtonPages = ["/login", "/register"];

  return (
    <aside
      id="headerSidebar"
      className={`bg-orange-600 dark:bg-[#1a1a1a] text-white h-full w-24 flex flex-col items-center py-4`}
    >
      <div className="flex-grow text-2xl items-center font-bold mb-3">Logo</div>
      <nav className="flex flex-col items-center space-y-6">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-[#b8860b]"
        >
          <FaHome size={24} />
        </button>
        {noButtonPages.includes(window.location.pathname) ? null : (
          <>
            <button className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-[#b8860b]">
              <FaUsers size={24} />
            </button>
            <button className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-[#b8860b]">
              <FaComments size={24} />
            </button>
          </>
        )}
      </nav>
      <div className="flex-grow h-full"></div>
      <div className="flex flex-col space-y-6 items-center h-min">
        <ThemeSwitcher />
        {isLoggedIn ? (
          <>
            <button className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-[#b8860b]">
              <FaCog size={24} />
            </button>
            <button
              onClick={() => {
                navigate("/logout");
              }}
              className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-[#b8860b]"
            >
              <FaUser size={24} />
            </button>
          </>
        ) : (
          <div className="flex flex-col space-y-4">
            <a
              className="text-center text-white no-underline dark:hover:text-[#b8860b] hover:text-orange-700 hover:cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Sign In
            </a>
            <a
              className="text-center text-white no-underline dark:hover:text-[#b8860b] hover:text-orange-700 hover:cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </a>
          </div>
        )}
      </div>
    </aside>
  );
};

export default HeaderSidebar;
