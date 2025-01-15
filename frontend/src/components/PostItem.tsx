import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "./PostsComponent";

type PostItemProps = {
  post: Post;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const navigate = useNavigate();

  const formattedDate = useMemo(
    () =>
      new Date(post.created_at).toLocaleDateString("en-UK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [post.created_at],
  );

  const handleClicked = () => {
    navigate(`/users/profile/${post.author_id}`);
  };

  return (
    <div className="p-2 rounded-lg flex">
      <img
        src={post.author_avatar}
        onClick={handleClicked}
        className="w-10 h-10 rounded-full hover:cursor-pointer"
      />
      <div className="grid grid-cols-1 p-1 w-full">
        <h1
          onClick={handleClicked}
          className="text-xl pl-3 hover:cursor-pointer font-bold dark:text-gray-200"
        >
          {post.author_firstName} {post.author_lastName}
        </h1>
        <p className="text-gray-600 dark:text-gray-500 text-xs">
          @{post.author_username} | {formattedDate}
        </p>
        <h3 className="ml-8 text-xl p-2 font-bold dark:text-gray-300">
          {post.title}
        </h3>
        <p className="p-0 text-xs dark:text-gray-400">{post.content}</p>
      </div>
    </div>
  );
};

export default PostItem;
