import React, { Suspense } from "react";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

const ProfileFollowUser = React.lazy(() => import("./ProfileFollowUser"));
const ProfileAddFriend = React.lazy(() => import("./ProfileAddFriend"));

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
        <div className="flex absolute bottom-0 right-0 pr-4 space-x-2">
          <Suspense fallback={<div></div>}>
            <ProfileFollowUser profileUserId={profileUserId} />
            <ProfileAddFriend profileUserId={profileUserId} />
          </Suspense>
          {isLoggedIn && userId === profileUserId && (
            <button
              onClick={toggleEditing}
              className="bg-gray-400 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
