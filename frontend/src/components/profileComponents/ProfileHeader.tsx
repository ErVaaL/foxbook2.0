import React from "react";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

type ProfileHeaderProps = {
  profileUserId: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string;
  toggleEditing: () => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileUserId,
  firstName,
  lastName,
  username,
  toggleEditing,
  avatarUrl,
}) => {
  const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-full flex space-x-3 h-40 p-4">
      <img
        src={avatarUrl}
        alt={`User avatar`}
        className="w-36 h-36 rounded-lg border-2 border-black dark:border-white object-cover text-center text-black dark:text-white"
      />
      <div className="flex-grow relative">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          {firstName} {lastName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">@{username}</p>
        <div className="absolute bottom-0 right-0 pr-4 space-x-2">
          {isLoggedIn && userId !== profileUserId && (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Follow
            </button>
          )}
          {isLoggedIn && userId === profileUserId && (
            <button onClick={toggleEditing} className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white font-bold py-2 px-4 rounded">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
