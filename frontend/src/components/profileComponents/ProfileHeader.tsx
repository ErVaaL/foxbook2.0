import React from "react";

type ProfileHeaderProps = {
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  firstName,
  lastName,
  username,
  avatarUrl,
}) => {
  console.log(avatarUrl);
  
  return (
    <div className="w-full flex space-x-3 h-40 p-4">
      <img
        src={avatarUrl}
        alt={`User avatar`}
        className="w-36 h-36 rounded-lg border-2 border-black dark:border-white object-cover text-center text-black dark:text-white"
      />
      <div className="flex-grow">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          {firstName} {lastName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">@{username}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
