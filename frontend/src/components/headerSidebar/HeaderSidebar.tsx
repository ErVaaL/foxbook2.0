import React, { useState } from "react";
import { FaHome, FaUsers, FaComments } from "react-icons/fa";
import "./HeaderSidebar.module.css";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/authSlice";
import LogoutModal from "../settingsComponents/LogoutModal";
import SettingsButton from "./SettingsButton";
import ProfileButton from "./ProfileButton";
import UniversalHeaderSidebarButton from "./UniversalHeaderSidebarButton";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import axios from "axios";

const HeaderSidebar: React.FC = () => {
  const { isLoggedIn, token, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const buttonList = [
    {
      icon: <FaHome size={24} />,
      action: () => navigate("/"),
    },
    {
      icon: <FaUsers size={24} />,
      action: () => navigate("/groups"),
    },
    {
      icon: <FaComments size={24} />,
      action: () => navigate("/"),
    },
  ];

  const accountButtons = [
    { text: "Sign in", action: () => navigate("/login") },
    { text: "Sign up", action: () => navigate("/register") },
  ];

  const serverLogout = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (![200, 204].includes(response.status)) {
        throw new Error("Invalid response");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || "Failed to log out");
      }
    }
  };

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <>
          <SettingsButton setShowLogoutModal={setShowLogoutModal} />
          <ProfileButton
            handleProfileNavigation={handleProfileNavigation}
            userAvatar={user?.avatar}
          />
        </>
      );
    } else {
      return (
        <div className="flex flex-col space-y-4">
          {accountButtons.map((button, index) => (
            <UniversalHeaderSidebarButton key={index} {...button} />
          ))}
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
        {buttonList.map((button, index) => (
          <UniversalHeaderSidebarButton key={index} {...button} />
        ))}
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
            serverLogout();
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
