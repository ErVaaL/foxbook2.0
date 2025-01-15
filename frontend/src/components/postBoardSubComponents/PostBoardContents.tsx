import React from "react";
import { API_ENDPOINTS } from "../../config";
import PostsComponent from "../universal/PostsComponent";

const PostBoardContents: React.FC = () => {
  return <PostsComponent endpoint={API_ENDPOINTS.POSTS} />;
};
export default PostBoardContents;
