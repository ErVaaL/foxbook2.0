import React from "react";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

type ProfileFollowUserProps = {
  profileUserId: string;
};

const ProfileFollowUser: React.FC<ProfileFollowUserProps> = ({
  profileUserId,
}) => {
  const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);

  return isLoggedIn && userId !== profileUserId ? (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Follow
    </button>
  ) : null;
};

export default ProfileFollowUser;
