import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import Loader from "../Loader";
import FriendItem from "./FriendItem";
import FriendActions from "./FriendActions";
import ChatWindow from "./ChatWindow";

export type Friend = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar: string;
};

const ChatList: React.FC = () => {
  const { isLoggedIn, token, userId } = useSelector(
    (state: RootState) => state.auth,
  );
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [openActions, setOpenActions] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [actionsPosition, setActionsPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchUserFriends = async () => {
      if (!token || !userId) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.USER_FRIENDS(userId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status !== 200)
          throw new Error("Failed to fetch user friends");
        const friends = response.data.friends;
        setFriends(friends);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserFriends();
  }, [token, userId]);

  const handleFriendClick = (friend: Friend) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setSelectedFriend(friend);
    setOpenActions(true);
    setActionsPosition({
      top: rect.top + window.scrollY + 30,
      left: rect.left + window.scrollX - 30,
    });
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedFriend(null);
  };

  if (!isLoggedIn) {
    return (
      <aside
        className={`bg-gray-100 dark:bg-[#282828] transition-colors duration-200 text-black dark:text-white w-1/6 shadow-lg p-4`}
        id="chatList"
      >
        <div className="flex flex-col items-center text-center">
          <h2 className="flex flex-grow m-2 text-2xl font-bold">Chat List</h2>
          <p className="text-lg">Please login to see chat list</p>
        </div>
      </aside>
    );
  }

  if (loading)
    return (
      <aside
        className={`bg-gray-100 dark:bg-[#282828] transition-colors duration-200 text-black dark:text-white w-1/6 shadow-lg p-4`}
        id="chatList"
      >
        <Loader size={60} />;
      </aside>
    );
  if (error)
    return (
      <aside
        className={`bg-gray-100 dark:bg-[#282828] transition-colors duration-200 text-black dark:text-white w-1/6 shadow-lg p-4`}
        id="chatList"
      >
        <p className="text-red-500">{error}</p>;
      </aside>
    );
  if (friends.length === 0)
    return (
      <aside
        className={`bg-gray-100 dark:bg-[#282828] transition-colors duration-200 text-black dark:text-white w-1/6 shadow-lg p-4`}
        id="chatList"
      >
        <div className="flex flex-col items-center text-center">
          <h2 className="flex flex-grow m-2 text-2xl font-bold">Chat List</h2>
          <p className="text-lg">No friends found</p>
        </div>
      </aside>
    );

  return (
    <>
      <aside
        className={`bg-gray-100 dark:bg-[#282828] transition-colors duration-200 text-black dark:text-white w-1/6 shadow-lg p-4`}
        id="chatList"
      >
        <div className="flex flex-col items-center text-center">
          <h2 className="flex flex-grow m-2 text-2xl font-bold">Chat List</h2>
          {friends.map((friend: Friend) => (
            <FriendItem
              key={friend.id}
              friend={friend}
              onClick={handleFriendClick}
            />
          ))}
        </div>
      </aside>
      {selectedFriend && openActions && (
        <FriendActions
          friend={selectedFriend}
          onClose={handleCloseChat}
          onOpenChat={() => {
            setOpenActions(false);
            setChatOpen(true);
          }}
          position={actionsPosition!}
        />
      )}
      {chatOpen && (
        <ChatWindow friend={selectedFriend} onClose={handleCloseChat} />
      )}
    </>
  );
};

export default ChatList;
