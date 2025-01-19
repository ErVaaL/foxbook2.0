import React from "react";
import DefaultAvatar from "../../assets/default-profile.png";
import { FaUser } from "react-icons/fa";

const DEFAULT_AVATAR = DefaultAvatar;

type ProfileButtonProps = {
  handleProfileNavigation: () => void;
  userAvatar?: string;
};

const ProfileButton: React.FC<ProfileButtonProps> = ({
  handleProfileNavigation,
  userAvatar,
}) => {
  return (
    <button
      onClick={handleProfileNavigation}
      className="hover:text-white bg-orange-400 dark:bg-[#2e2e2e] dark:hover:bg-darkgoldenrod hover:bg-orange-700 w-12 h-12 flex items-center justify-center"
    >
      <FaUser size={24} className="text-white" />
      <img
        src={userAvatar || DEFAULT_AVATAR}
        alt=""
        className="absolute w-10 h-10 rounded-full object-cover"
      />
    </button>
  );
};

export default ProfileButton;
