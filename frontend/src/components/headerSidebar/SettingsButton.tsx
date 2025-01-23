import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import SettingsDropdown from "../settingsComponents/SettingsDropdown";
import { useNavigate } from "react-router-dom";

type SettingsButtonProps = {
  setShowLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const SettingsButton: React.FC<SettingsButtonProps> = ({
  setShowLogoutModal,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
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
          onMaster={() => {
            navigate("/master-control");
            setShowDropdown(false);
          }}
          closeDropdown={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default SettingsButton;
