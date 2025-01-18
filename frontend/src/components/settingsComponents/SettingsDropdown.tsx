import React, { useEffect, useRef } from "react";

type SettingsDropdownProps = {
  onSettings: () => void;
  onLogout: () => void;
  closeDropdown: () => void;
};

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  onSettings,
  onLogout,
  closeDropdown,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDropdown]);

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-0 left-20 mt-2 w-40 bg-white dark:bg-gray-700 shadow-md rounded-md z-50"
    >
      <ul className="py-2">
        <li
          onClick={() => {
            onSettings();
            closeDropdown();
          }}
          className="cursor-pointer px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Settings
        </li>
        <li
          onClick={() => {
            onLogout();
            closeDropdown();
          }}
          className="cursor-pointer px-4 py-2 text-red-600 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Log Out
        </li>
      </ul>
    </div>
  );
};

export default SettingsDropdown;
