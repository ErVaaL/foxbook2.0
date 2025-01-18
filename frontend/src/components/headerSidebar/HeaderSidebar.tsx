import React, { useState } from "react";
import { FaHome, FaCog, FaUser, FaUsers, FaComments } from "react-icons/fa";
import "./HeaderSidebar.module.css";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/authSlice";
import SettingsDropdown from "../settingsComponents/SettingsDropdown";
import LogoutModal from "../settingsComponents/LogoutModal";

const HeaderSidebar: React.FC = () => {
  const { isLoggedIn, token, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleProfileNavigation = () => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.user_id) navigate(`/users/profile/${payload.user_id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <>
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="relative hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 dark:hover:bg-darkgoldenrod"
            >
              <FaCog size={24} />
            </button>
            {showDropdown && (
              <SettingsDropdown
                onSettings={() => {
                  navigate("/settings");
                  setShowDropdown(false);
                }}
                onLogout={() => {
                  setShowLogoutModal(true);
                }}
                closeDropdown={() => setShowDropdown(false)}
              />
            )}
          </div>
          <button
            onClick={handleProfileNavigation}
            className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] dark:hover:bg-darkgoldenrod hover:bg-orange-700 w-12 h-12 flex items-center justify-center"
          >
            <FaUser size={24} className="text-white" />
            <img
              src={user?.avatar}
              alt="Profile"
              className="absolute w-10 h-10 rounded-full object-cover"
            />
          </button>
        </>
      );
    } else {
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
    }
  };

  return (
    <aside
      id="headerSidebar"
      className="bg-orange-600 dark:bg-[#1a1a1a] text-white w-24 flex flex-col items-center py-4"
    >
      <div className="flex-grow text-2xl items-center font-bold mb-3">Logo</div>
      <nav className="flex flex-col items-center space-y-6">
        <button
          onClick={() => navigate("/")}
          className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 dark:hover:bg-darkgoldenrod"
        >
          <FaHome size={24} />
        </button>
        <button
          onClick={() => navigate("/groups")}
          className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 dark:hover:bg-darkgoldenrod"
        >
          <FaUsers size={24} />
        </button>
        <button className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] hover:bg-orange-700 dark:hover:bg-darkgoldenrod">
          <FaComments size={24} />
        </button>
      </nav>
      <div className="flex-grow h-full"></div>
      <div className="flex flex-col space-y-6 items-center h-min">
        <ThemeSwitcher />
        {renderAuthButtons()}
      </div>
      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => {
            dispatch(logout());
            setShowLogoutModal(false);
            navigate("/login");
          }}
        />
      )}
    </aside>
  );
};

export default HeaderSidebar;
