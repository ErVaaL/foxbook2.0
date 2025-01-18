import React from "react";
import { FaHome, FaCog, FaUser, FaUsers, FaComments } from "react-icons/fa";
import "./HeaderSidebar.module.css";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import DefaultAvatar from "../../assets/default-profile.png";

const DEFAULT_PROFILE_AVATAR = DefaultAvatar;

const HeaderSidebar: React.FC = () => {
  const { isLoggedIn, token, user } = useSelector(
    (state: RootState) => state.auth,
  );
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
          <button className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-darkgoldenrod">
            <FaCog size={24} />
          </button>

          <button
            onClick={() => handleProfileNavigation()}
            className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-darkgoldenrod w-12 h-12 flex items-center justify-center"
          >
            <FaUser size={24} className="text-white" />
            <img
              src={user?.avatar}
              alt={DEFAULT_PROFILE_AVATAR}
              className="absolute w-10 h-10 rounded-full object-cover"
            />
          </button>
        </>
      );
    }

    return (
      <div className="flex flex-col space-y-4">
        <a
          className="text-center text-white no-underline dark:hover:text-darkgoldenrod hover:text-orange-700 hover:cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Sign In
        </a>
        <a
          className="text-center text-white no-underline dark:hover:text-darkgoldenrod hover:text-orange-700 hover:cursor-pointer"
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
        <button
          onClick={() => navigate("/groups")}
          className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-darkgoldenrod"
        >
          <FaUsers size={24} />
        </button>
        <button className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-darkgoldenrod">
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
          className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 hover:dark:bg-darkgoldenrod"
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
