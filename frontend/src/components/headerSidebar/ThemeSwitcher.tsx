import React from "react";
import Switch from "react-switch";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Switch
      checked={theme === "dark"}
      onChange={toggleTheme}
      offColor="#cccccc"
      onColor="#374151"
      offHandleColor="#fbbf24"
      onHandleColor="#4b5563"
      uncheckedIcon={
        <div style={{ textAlign: "center", fontSize: 19 }}>☀️</div>
      }
      checkedIcon={<div style={{ textAlign: "center", fontSize: 19 }}>🌙</div>}
      handleDiameter={24}
      height={28}
      width={60}
    />
  );
};

export default ThemeSwitcher;
