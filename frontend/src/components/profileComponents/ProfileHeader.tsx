import React, { Suspense } from "react";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import DefaultAvatar from "../../assets/default-profile.png";

const ProfileFollowUser = React.lazy(() => import("./ProfileFollowUser"));
const ProfileAddFriend = React.lazy(() => import("./ProfileAddFriend"));

const DEFAULT_AVATAR = DefaultAvatar;

type ProfileHeaderProps = {
  profileUserId: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string;
  toggleEditing: () => void;
  privacy: "public" | "private" | "friends_only";
  isFriend: boolean;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileUserId,
  firstName,
  lastName,
  username,
  avatarUrl,
  toggleEditing,
  privacy,
  isFriend,
}) => {
  const { userId } = useSelector((state: RootState) => state.auth);
  const isOwner = userId === profileUserId;

  const canViewFullName =
    isOwner || privacy === "public" || (privacy === "friends_only" && isFriend);
  const canViewAvatar =
    isOwner || privacy === "public" || (privacy === "friends_only" && isFriend);

  return (
    <div className="w-full flex space-x-3 h-40 p-4">
      {canViewAvatar ? (
        <img
          src={avatarUrl}
          alt={`User avatar`}
          className="w-36 h-36 rounded-lg border-2 border-black dark:border-white object-cover"
        />
      ) : (
        <img
          src={avatarUrl}
          alt={DEFAULT_AVATAR}
          className="w-36 h-36 rounded-lg border-2 border-black dark:border-white object-cover"
        />
      )}
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
          {isOwner && (
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
