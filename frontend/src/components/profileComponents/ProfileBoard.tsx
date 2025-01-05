import React, { useState } from "react";
import ProfileBoardNav from "./profileBoardSubComponents/ProfileBoardNav";
import ProfileBoardPosts from "./profileBoardSubComponents/ProfileBoardPosts";
import ProfileBoardGroups from "./profileBoardSubComponents/ProfileBoardGroups";
import { useParams } from "react-router-dom";
import ProfileBoardFriends from "./profileBoardSubComponents/ProfileBoardFriends";

const ProfileBoard: React.FC = () => {
  const [activeSession, setActiveSession] = useState<string>("Posts");
  const { userId } = useParams<{ userId: string }>();
  if (!userId) return <div>Invalid user ID</div>;
  return (
    <div className="flex-grow h-full">
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
      {activeSession === "Posts" && <ProfileBoardPosts userId={userId} />}
      {activeSession === "Groups" && <ProfileBoardGroups userId={userId} />}
      {activeSession === "Friends" && <ProfileBoardFriends userId={userId} />}
    </div>
  );
};

export default ProfileBoard;
