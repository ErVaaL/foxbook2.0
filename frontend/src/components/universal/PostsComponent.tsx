import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchPosts, selectAllPosts } from "../../store/postSlice";
import Loader from "../Loader";
import PostItem from "../PostItem";

interface PostsComponentProps {
  userId?: string;
  groupId?: string;
}

const PostsComponent: React.FC<PostsComponentProps> = ({ userId, groupId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) =>
    selectAllPosts(state, userId),
  );
  const loading = useSelector((state: RootState) => state.posts.loading);
  const error = useSelector((state: RootState) => state.posts.error);

  useEffect(() => {
    dispatch(fetchPosts({ userId, groupId }));
  }, [dispatch, userId, groupId]);

  if (loading) return <Loader size={50} />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!posts.length) return <p>No posts available.</p>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem key={post.id} postId={post.id} />
      ))}
    </div>
  );
};

export default PostsComponent;
