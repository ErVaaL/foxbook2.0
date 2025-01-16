import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import Loader from "../Loader";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import DefaultAvatar from "../../assets/default-profile.png";

const DEFAULT_AVATAR = DefaultAvatar;

type InviteModalProps = {
  groupId: string;
  onClose: () => void;
};

interface Friend {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
}

const InviteModal: React.FC<InviteModalProps> = ({ groupId, onClose }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!userId) throw new Error("User not logged in");
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.USER_FRIENDS(userId)}`,
        );
        if (![200, 202].includes(response.status))
          throw new Error("Failed to fetch friends");

        const friendsList = response.data.friends;

        setFriends(friendsList);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [groupId, userId]);

  const handleInvite = async (friendId: string) => {};

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold dark:text-gray-300">Invite Friends</h2>
        <ul className="mt-4 space-y-2">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex justify-between items-center py-3 border-t border-b border-gray-300"
            >
              <span className="flex gap-2 items-center dark:text-gray-300">
                <img
                  src={friend.avatar}
                  className="w-8 h-8 rounded-full"
                  alt={DEFAULT_AVATAR}
                />
                {friend.username}
              </span>
              <button className="px-3 py-1 bg-orange-500 hover:bg-orange-600 dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover text-white rounded">
                Invite
              </button>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 w-full bg-gray-400 p-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InviteModal;
