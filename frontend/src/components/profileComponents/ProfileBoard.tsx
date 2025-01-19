import React, { useState } from "react";
import ProfileBoardNav from "./profileBoardSubComponents/ProfileBoardNav";
import ProfileBoardGroups from "./profileBoardSubComponents/ProfileBoardGroups";
import { useParams } from "react-router-dom";
import ProfileBoardFriends from "./profileBoardSubComponents/ProfileBoardFriends";
import ProfileBoardEvents from "./profileBoardSubComponents/ProfileBoardEvents";
import ProfileBoardAbout from "./profileBoardSubComponents/ProfileBoardAbout";
import { API_ENDPOINTS } from "../../config";
import PostsComponent from "../universal/PostsComponent";

type Address = {
  country: string;
  state: string;
  city: string;
};

type ProfileBoardProps = {
  email: string;
  phone: string;
  birthday: string;
  address: Address;
  privacy: "public" | "private" | "friends_only";
  isFriend: boolean;
  isOwner: boolean;
};

const ProfileBoard: React.FC<ProfileBoardProps> = ({
  email,
  phone,
  birthday,
  address,
  privacy,
  isFriend,
  isOwner,
}) => {
  const [activeSession, setActiveSession] = useState<string>("Posts");
  const { userId } = useParams<{ userId: string }>();
  if (!userId) return <div>Invalid user ID</div>;

  const canViewDetails =
    privacy === "public" || isOwner || (privacy === "friends_only" && isFriend);

  return (
    <div className="flex-grow">
      <div className="relative w-full h-12">
        <span className="absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-gray-400 via-gray-500 to-transparent"></span>
      </div>
      <div className="flex justify-center items-center ">
        <ProfileBoardNav
          activeSession={activeSession}
          setActiveSession={setActiveSession}
        />
      </div>
      <div className="relative w-full h-12">
        <span className="absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-gray-400 via-gray-500 to-transparent"></span>
      </div>

      {canViewDetails ? (
        <>
          {activeSession === "Posts" && <PostsComponent userId={userId} />}
          {activeSession === "Groups" && <ProfileBoardGroups userId={userId} />}
          {activeSession === "Friends" && (
            <ProfileBoardFriends userId={userId} />
          )}
          {activeSession === "Events" && <ProfileBoardEvents userId={userId} />}
          {activeSession === "About" && (
            <ProfileBoardAbout
              email={email}
              phone={phone}
              birthday={birthday}
              address={address}
            />
          )}
        </>
      ) : (
        <div className="text-center text-gray-700 dark:text-gray-300">
          <p>This profile is private.</p>
          <p>
            {privacy === "friends_only"
              ? "Only friends can see full details."
              : "Only the profile owner can see full details."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileBoard;
