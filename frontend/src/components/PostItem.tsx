import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  likePost,
  fetchComments,
  addComment,
  selectPostById,
  selectCommentsForPost,
  selectLoading,
  selectError,
} from "../store/postSlice";
import Loader from "./Loader";
import { formatDate } from "../utils/formatDate";

type PostItemProps = {
  postId: string;
};

const PostItem: React.FC<PostItemProps> = ({ postId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const post = useSelector((state: RootState) => selectPostById(state, postId));
  const comments = useSelector((state: RootState) =>
    selectCommentsForPost(state, postId),
  );
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const isLiked = userId ? (post?.like_ids.includes(userId) ?? false) : false;
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchComments({ postId, page: 1 }));
  }, [dispatch, postId]);

  const formattedDate = useMemo(
    () =>
      new Date(post.created_at).toLocaleDateString("en-UK", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
    [post.created_at],
  );

  const handleClicked = () => {
    navigate(`/users/profile/${post.author.id}`);
  };

  const handleLike = () => {
    if (!post) return;
    if (!isLoggedIn) return;

    const updatedLikeIds = isLiked
      ? post.like_ids.filter((id) => id !== userId)
      : [...post.like_ids, userId];

    dispatch({
      type: "posts/likeOptimisticUpdate",
      payload: { postId: post.id, like_ids: updatedLikeIds },
    });

    dispatch(likePost(post.id));
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
    if (!comments.length) {
      dispatch(fetchComments({ postId, page: 1 }));
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      dispatch(addComment({ postId, content: commentInput }));
      setCommentInput("");
    }
  };

  const handleNavigate = (id: string) => {
    navigate(`/users/profile/${id}`);
  };

  if (!post) {
    return (
      <div className="p-4">
        <Loader size={60} />
      </div>
    );
  }
  return (
    <div className="p-2 rounded-lg flex w-full border border-gray-400 shadow dark:bg-[#1a1a1a] bg-gray-100">
      <img
        src={post.author.avatar}
        onClick={handleClicked}
        className="w-10 h-10 rounded-full hover:cursor-pointer"
        alt="Author Avatar"
      />
      <div className="grid grid-cols-1 p-1 w-full">
        <h1
          onClick={handleClicked}
          className="text-xl pl-3 hover:cursor-pointer font-bold dark:text-gray-200"
        >
          {post.author.first_name} {post.author.last_name}
        </h1>
        <p
          className="text-gray-600 dark:text-gray-400 text-xs hover:cursor-pointer"
          onClick={() => handleNavigate(post.author.id)}
        >
          @{post.author.username} | {formattedDate}
        </p>
        <h3 className="ml-24 mt-3 text-xl p-2 font-bold dark:text-gray-300">
          {post.title}
        </h3>
        <p className="p-0 text-xs dark:text-gray-400">{post.contents}</p>

        <div className="flex items-center space-x-4 mt-3">
          <button
            onClick={handleLike}
            className={`${isLiked ? "text-blue-400" : "dark:text-gray-300 text-gray-700 hover:cursor-default"}`}
          >
            👍 {post.likes_count}
          </button>
          <button onClick={handleToggleComments} className="text-gray-500">
            <span className="dark:text-gray-200 text-gray-700">
              💬 {post.comments_count}
            </span>
          </button>
        </div>

        {showComments && (
          <div className="mt-2 border-t border-gray-300 pt-2">
            {isLoggedIn && (
              <form onSubmit={handleAddComment} className="flex items-center">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="border rounded w-full p-1"
                  placeholder="Write a comment..."
                />
                <button
                  type="submit"
                  className="ml-2 bg-orange-500 hover:bg-orange-600 dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover text-white px-3 py-1 rounded"
                >
                  Post
                </button>
              </form>
            )}
            {loading && (
              <p className="text-gray-500 text-sm">Loading comments...</p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="mt-2 max-h-40 overflow-y-auto">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="text-sm p-4 border dark:text-gray-300 flex flex-col gap-2 rounded-lg bg-gray-200 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={comment.avatar}
                      className="w-7 h-7 rounded-full hover:cursor-pointer"
                      alt=""
                      onClick={() => handleNavigate(comment.userId)}
                    />
                    <strong
                      className="hover:cursor-pointer"
                      onClick={() => handleNavigate(comment.userId)}
                    >
                      @{comment.username}
                    </strong>{" "}
                    <span>•</span>
                    {formatDate(comment.createdAt)}
                  </div>
                  <p className="px-6">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;
