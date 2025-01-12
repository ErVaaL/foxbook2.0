import React from "react";
import { useDispatch } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AppDispatch } from "../../store";
import {
  toggleNotificationSeen,
  updateNotificationContent,
} from "../../store/notificationSlice";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    attributes: {
      type: string;
      was_seen: boolean;
      created_at: string;
      content: Record<string, any>;
    };
  };
  token: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  token,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const acceptFriendRequest = async () => {
    if (!token) return;
    try {
      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.FRIEND_REQUEST_ACTION(notification.attributes.content.sender_id)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        console.log(`Friend request accepted, ${response.data}`);
        dispatch(
          updateNotificationContent({
            id: notification.id,
            content: { action_taken: true },
          }),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const rejectFriendRequest = async () => {
    if (!token) return;
    try {
      const response = await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.FRIEND_REQUEST_ACTION(notification.attributes.content.sender_id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        console.log(`Friend request rejected, ${response.data}`);
        dispatch(
          updateNotificationContent({
            id: notification.id,
            content: { action_taken: true },
          }),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSeen = () => {
    if (token) {
      dispatch(toggleNotificationSeen({ id: notification.id, token }));
    }
  };

  return (
    <div
      key={notification.id}
      className={`p-3 border-b rounded-lg ${
        notification.attributes.was_seen
          ? "bg-gray-100"
          : "bg-blue-100 font-bold"
      }`}
    >
      <p>{notification.attributes.content.message}</p>
      <div className="flex gap-2 mt-2">
        {notification.attributes.type === "friend_request" &&
          !notification.attributes.content.action_taken && (
            <>
              <button
                onClick={acceptFriendRequest}
                className="text-green-500 text-sm"
              >
                Accept
              </button>
              <button
                onClick={rejectFriendRequest}
                className="text-red-500 text-sm"
              >
                Reject
              </button>
            </>
          )}
        <button onClick={toggleSeen} className="text-blue-500 text-sm">
          {notification.attributes.was_seen ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
