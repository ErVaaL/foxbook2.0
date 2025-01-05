import React from "react";
import { Post } from "./ProfileBoardPosts";

type ProfilePostProps = {
  post: Post;
};

const ProfilePost: React.FC<ProfilePostProps> = ({ post }) => {
  return (
    <div className="border p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold">{post.title}</h2>
      <p className="text-gray-500">{post.content}</p>
    </div>
  );
};

export default ProfilePost;
