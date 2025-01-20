import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  likePost,
  fetchComments,
  addComment,
  updatePost,
  selectPostById,
  selectCommentsForPost,
  selectLoading,
  selectError,
  deletePost,
} from "../store/postSlice";
import Loader from "./Loader";
import CommentItem from "./CommentItem";
import { formatDate } from "../utils/formatDate";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import axios from "axios";
import { User } from "../forms/postCreation/PostCreation";
import UserMention from "../forms/postCreation/UserMention";

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
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post?.title || "");
  const [editedContent, setEditedContent] = useState(post?.contents || "");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isLiked = userId ? (post?.like_ids.includes(userId) ?? false) : false;
  const { token } = useSelector((state: RootState) => state.auth);

  const [users, setUsers] = useState<{ data: User[] }>({ data: [] });
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [mentionIndex, setMentionIndex] = useState<number | null>(null);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showComments) dispatch(fetchComments({ postId, page: 1 }));
  }, [dispatch, postId, showComments, post?.comments_count]);

  const formattedDate = useMemo(
    () => formatDate(post?.created_at),
    [post?.created_at],
  );

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.USERS}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, [token]);

  const handleNavigate = (id: string) => navigate(`/users/profile/${id}`);

  const handleLike = () => {
    if (!post || !isLoggedIn) return;
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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      await dispatch(addComment({ postId, content: commentInput }));
      setCommentInput("");
      dispatch({
        type: "posts/updateCommentCount",
        payload: { postId, change: 1 },
      });
      dispatch(fetchComments({ postId, page: 1 }));
    }
  };

  const handleEditPost = () => {
    if (editedTitle.trim() && editedContent.trim() && post) {
      dispatch(
        updatePost({
          postId: post.id,
          title: editedTitle,
          contents: editedContent,
        }),
      );
    }
    setIsEditing(false);
  };

  const handleDeletePost = () => {
    dispatch(deletePost(postId));
    setShowDeleteModal(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    setEditedContent(value);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);

    if (textBeforeCursor.endsWith(" ")) {
      setFilteredUsers([]);
      setMentionIndex(null);
      return;
    }

    const match = textBeforeCursor.match(/@(\w+)$/);
    if (match) {
      const searchTerm = match[1].toLowerCase();
      setFilteredUsers(
        users.data.filter((user) =>
          user.attributes.username.toLowerCase().includes(searchTerm),
        ),
      );
      setMentionIndex(cursorPosition - match[0].length);
      setSelectedMentionIndex(0);
    } else {
      setFilteredUsers([]);
      setMentionIndex(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (filteredUsers.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedMentionIndex((prev) => (prev + 1) % filteredUsers.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedMentionIndex((prev) =>
        prev === 0 ? filteredUsers.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (mentionIndex !== null) {
        const selectedUser = filteredUsers[selectedMentionIndex];
        handleUserSelect(selectedUser);
      }
    }
  };

  const handleUserSelect = (user: User) => {
    if (mentionIndex === null) return;

    const textBeforeMention = editedContent.slice(0, mentionIndex);
    const textAfterMention = editedContent
      .slice(mentionIndex)
      .replace(/^@\w*/, "");

    const newText = `${textBeforeMention}@${user.attributes.username} ${textAfterMention}`;
    setEditedContent(newText);
    setFilteredUsers([]);
    setMentionIndex(null);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          mentionIndex + user.attributes.username.length + 2;
      }
    }, 0);
  };

  if (!post) return <Loader size={60} />;

  return (
    <div
      id={`post-${post.id}`}
      className="p-2 rounded-lg flex w-full border border-gray-400 shadow dark:bg-[#1a1a1a] bg-gray-100 transistion-all duration-200"
    >
      <img
        src={post.author.avatar}
        onClick={() => handleNavigate(post.author.id)}
        className="w-10 h-10 rounded-full hover:cursor-pointer"
        alt="Author Avatar"
      />
      <div className="grid grid-cols-1 p-1 w-full">
        <h1
          onClick={() => handleNavigate(post.author.id)}
          className="text-xl pl-3 hover:cursor-pointer font-bold dark:text-gray-200"
        >
          {post.author.first_name} {post.author.last_name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-xs hover:cursor-pointer">
          @{post.author.username} | {formattedDate}
        </p>

        {isEditing ? (
          <div className="flex flex-col mt-3">
            <input
              type="text"
              className="w-full p-2 border rounded text-xl font-bold"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              ref={textareaRef}
              className="w-full p-2 border rounded mt-2"
              value={editedContent}
              rows={4}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
            />
            {filteredUsers.length > 0 && mentionIndex !== null && (
              <div className="absolute bg-white border rounded shadow-lg max-w-xs mt-1 z-50">
                {filteredUsers.map((user, index) => (
                  <UserMention
                    key={user.id}
                    index={index}
                    selectedMentionIndex={selectedMentionIndex}
                    user={user}
                    setSelectedMentionIndex={setSelectedMentionIndex}
                    handleUserSelect={handleUserSelect}
                  />
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleEditPost}
                className="text-green-600 hover:text-green-800 px-3 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-red-500 hover:text-red-700 px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="ml-24 mt-3 text-xl p-2 font-bold dark:text-gray-300">
              {post.title}
            </h3>
            <p className="p-0 text-xs dark:text-gray-400">{post.contents}</p>
          </>
        )}

        <div className="flex space-x-4 mt-3">
          <div className="flex flex-grow gap-4">
            <button
              onClick={handleLike}
              className={`${isLiked ? "text-blue-400" : "dark:text-gray-300 text-gray-700 hover:cursor-default"}`}
            >
              👍 {post.likes_count}
            </button>
            <button onClick={handleToggleComments} className="text-gray-500">
              💬 {post.comments_count}
            </button>
          </div>
          {post.author.id === userId && !isEditing && (
            <div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-orange-500 dark:text-darkgoldenrod dark:hover:text-goldenrodhover hover:text-orange-700"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          )}
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
                  Comment
                </button>
              </form>
            )}

            {loading && <Loader size={60} />}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="mt-2 max-h-[500px] overflow-y-auto">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={post.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#2e2e2e] p-6 rounded-lg shadow-lg">
            <p className="dark:text-gray-200">
              Are you sure you want to delete this post?
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleDeletePost}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-500 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;
