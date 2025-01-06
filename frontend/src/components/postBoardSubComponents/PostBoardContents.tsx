import React from "react";
import PostsComponent from "../PostsComponent";
import { API_ENDPOINTS } from "../../config";

const PostBoardContents: React.FC = () => {
  return <PostsComponent endpoint={API_ENDPOINTS.POSTS} />;
};
export default PostBoardContents;
