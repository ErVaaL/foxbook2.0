import React from "react";
import { useNavigate } from "react-router-dom";

type NavigationButtonProps = {
  text: string;
  destination?: string;
};

const NavigationButton: React.FC<NavigationButtonProps> = ({
  text,
  destination,
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (!destination) return;
    navigate(destination);
  };
  return (
    <div className="flex flex-grow items-center">
      <button
        onClick={handleNavigation}
        className="mx-auto mb-2 w-96 h-full text-white bg-orange-400 hover:bg-orange-600 dark:bg-[#2e2e2e] dark:hover:bg-darkgoldenrod transition-colors duration-200"
      >
        {text}
      </button>
    </div>
  );
};

export default NavigationButton;
