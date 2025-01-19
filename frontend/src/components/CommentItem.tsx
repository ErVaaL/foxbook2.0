import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { formatDate } from "../utils/formatDate";
import { Comment, deleteComment, updateComment } from "../store/postSlice";
import { useNavigate } from "react-router-dom";

type CommentItemProps = {
  comment: Comment;
  postId: string;
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUserId = useSelector((state: RootState) => state.auth.userId);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleSave = () => {
    if (editedContent.trim()) {
      dispatch(
        updateComment({
          commentId: comment.id,
          postId,
          content: editedContent,
        }),
      );
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    dispatch(deleteComment({ commentId: comment.id, postId }));
  };

  const handleNavigate = (id: string) => {
    navigate(`/users/profile/${id}`);
  };

  return (
    <div className="my-2 text-sm p-4 border dark:text-gray-300 flex flex-col gap-2 rounded-lg bg-gray-200 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <img
          src={comment.avatar}
          className="w-7 h-7 rounded-full"
          alt=""
          onClick={() => handleNavigate(comment.userId)}
        />
        <strong
          className="hover:cursor-pointer"
          onClick={() => handleNavigate(comment.userId)}
        >
          @{comment.username}
        </strong>{" "}
        <span>•</span> {formatDate(comment.createdAt)}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            className="w-full p-1 border rounded text-gray-900"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-green-500 hover:text-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-red-500 hover:text-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="px-6">{comment.content}</p>
      )}

      {comment.userId === loggedInUserId && !isEditing && (
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className=" text-yellow-600 hover:text-yellow-800 dark:text-yellow-500"
          >
            Edit
          </button>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
