import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchPosts,
  selectAllPosts,
  selectLoading,
  selectError,
} from "../../store/postSlice";
import Loader from "../Loader";
import PostItem from "../PostItem";

type PostsComponentProps = {
  userId?: string;
};

const PostsComponent: React.FC<PostsComponentProps> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const posts = useSelector((state: RootState) =>
    selectAllPosts(state, userId),
  );
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchPosts({ userId }));
  }, [dispatch, userId]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col p-2 m-0 gap-4 items-center">
      {posts.length ? (
        posts.map((post) => <PostItem key={post.id} postId={post.id} />)
      ) : (
        <div className="text-center text-gray-500 place-self-center">
          <p>There are no posts to be shown</p>
        </div>
      )}
    </div>
  );
};

export default PostsComponent;
