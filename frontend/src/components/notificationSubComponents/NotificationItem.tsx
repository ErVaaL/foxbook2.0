import React from "react";
import { useDispatch } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AppDispatch } from "../../store";
import {
  markAsSeen,
  toggleNotificationSeen,
} from "../../store/notificationSlice";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import { useNavigate } from "react-router-dom";

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    attributes: {
      type: string;
      was_seen: boolean;
      created_at: string;
      content: Record<string, unknown>;
    };
  };
  token: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  token,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const acceptFriendRequest = async (senderId: string) => {
    if (!token) return;
    try {
      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.FRIEND_REQUEST_ACTION(senderId)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        console.log(`Friend request accepted, ${response.data}`);
        dispatch(markAsSeen(notification.id));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const rejectFriendRequest = async (senderId: string) => {
    if (!token) return;
    try {
      const response = await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.FRIEND_REQUEST_ACTION(senderId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        console.log(`Friend request rejected, ${response.data}`);
        dispatch(markAsSeen(notification.id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSeen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (token) {
      dispatch(toggleNotificationSeen({ id: notification.id, token }));
    }
  };
  const senderId = String(notification.attributes.content?.sender_id || "");

  const handleNotificationClick = () => {
    if (notification.attributes.type === "mentioned_in_post") {
      const postId = String(notification.attributes.content?.post_id || "");
      if (!postId) return;
      navigate(`/`, { state: { postId } });
    }
  };

  return (
    <div
      key={notification.id}
      onClick={handleNotificationClick}
      className={`p-3 rounded-lg ${
        notification.attributes.was_seen
          ? "bg-gray-100 dark:bg-[#3c3c3c] dark:text-gray-300"
          : "bg-orange-100 dark:bg-[#fcdc8d] font-bold"
      }`}
    >
      <p>{String(notification.attributes.content?.message || "No message")}</p>
      <div className="flex gap-2 mt-2">
        {notification.attributes.type === "friend_request" &&
          !notification.attributes.content?.action_taken && (
            <>
              <button
                onClick={() => acceptFriendRequest(senderId)}
                className="text-green-500 text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => rejectFriendRequest(senderId)}
                className="text-red-500 text-sm"
              >
                Reject
              </button>
            </>
          )}
        {!notification.attributes.content?.action_taken && (
          <button onClick={toggleSeen} className="text-blue-500 text-sm">
            {notification.attributes.was_seen ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
