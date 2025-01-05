import React from "react";
import { FaHome, FaCog, FaUser, FaUsers, FaComments } from "react-icons/fa";
import "./HeaderSidebar.module.css";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";

const HeaderSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const getUserIdFromToken = (): string | null => {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleProfileNavigation = () => {
    const userId = getUserIdFromToken();
    if (userId) navigate(`/users/profile/${userId}`);
  };

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <>
          <button className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-[#b8860b]">
            <FaCog size={24} />
          </button>

          <button
            onClick={() => handleProfileNavigation()}
            className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-[#b8860b]"
          >
            <FaUser size={24} />
          </button>
        </>
      );
    }

    return (
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
    );
  };

  const renderNavButtons = () => {
    const noButtonPages = ["/login", "/register"];

    if (noButtonPages.includes(window.location.pathname)) return null;

    return (
      <>
        <button className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-[#b8860b]">
          <FaUsers size={24} />
        </button>
        <button className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-[#b8860b]">
          <FaComments size={24} />
        </button>
      </>
    );
  };

  return (
    <aside
      id="headerSidebar"
      className={`bg-orange-600 dark:bg-[#1a1a1a] text-white w-24 flex flex-col items-center py-4`}
    >
      <div className="flex-grow text-2xl items-center font-bold mb-3">Logo</div>
      <nav className="flex flex-col items-center space-y-6">
        <button
          onClick={() => navigate("/")}
          className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-[#b8860b]"
        >
          <FaHome size={24} />
        </button>
        {renderNavButtons()}
      </nav>
      <div className="flex-grow h-full"></div>
      <div className="flex flex-col space-y-6 items-center h-min">
        <ThemeSwitcher />
        {renderAuthButtons()}
      </div>
    </aside>
  );
};

export default HeaderSidebar;
