import React from "react";
import ProfilePost from "./ProfilePost";

type Post = {
  id: string;
  title: string;
  content: string;
};

type ProfileBoardProps = {
  posts: Post[];
};

const ProfileBoard: React.FC<ProfileBoardProps> = ({ posts = [] }) => {
  return (
    <div className="flex-grow h-full">
      <div className="relative w-full h-12">
        <span className="absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-gray-400 via-gray-500 to-transparent"></span>
      </div>
      {posts.length ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <ProfilePost
              key={post.id}
              title={post.title}
              content={post.content}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>No posts available.</p>
        </div>
      )}
    </div>
  );
};

export default ProfileBoard;
