import React, { use, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type ProfileAddFriendProps = {
  profileUserId: string;
};

const friendsPromiseCache: Record<string, Promise<string[]>> = {};

const fetchFriends = (profileUserId: string): Promise<string[]> => {
  if (!friendsPromiseCache[profileUserId]) {
    friendsPromiseCache[profileUserId] = axios
      .get(`${API_BASE_URL}${API_ENDPOINTS.USER_FRIENDS(profileUserId)}`)
      .then((response) =>
        response.data.friends.map((friend: { id: string }) => friend.id),
      );
  }
  return friendsPromiseCache[profileUserId];
};

// const fetchUserSentRequests = (
//   userId: string,
//   token: string,
// ): Promise<string[]> => {
//   const sentRequests = axios.get(
//     `${API_BASE_URL}${API_ENDPOINTS.USER_SENT_REQUESTS(userId)}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );
// };

const ProfileAddFriend: React.FC<ProfileAddFriendProps> = ({
  profileUserId,
}) => {
  const { isLoggedIn, userId, token } = useSelector(
    (state: RootState) => state.auth,
  );

  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const friendIds = use(fetchFriends(profileUserId));
  const isFriend = userId ? friendIds.includes(userId) : false;

  const handleAddFriend = async () => {
    if (!token || !userId) return;

    try {
      setIsLoading(true);
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.SEND_FRIEND_REQUEST}`,
        {
          friend_id: profileUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setIsRequestSent(true);
    } catch (error) {
      console.error("Failed to send friend request", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoggedIn &&
        userId !== profileUserId &&
        !isFriend &&
        !isRequestSent && (
          <button
            onClick={handleAddFriend}
            className={`bg-orange-500 dark:bg-darkgoldenrod font-bold text-white px-4 py-2 rounded hover:bg-orange-600 dark:hover:bg-goldenrodhover ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Add Friend"}
          </button>
        )}
      {isRequestSent && !isFriend && (
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
          disabled
        >
          Request Sent
        </button>
      )}
    </div>
  );
};

export default ProfileAddFriend;
