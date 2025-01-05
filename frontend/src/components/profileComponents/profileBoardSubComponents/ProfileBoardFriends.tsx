import React, { useEffect, useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "../../../config";
import Loader from "../../Loader";
import DefaultAvatar from "../../../assets/default-profile.png";
import { useNavigate } from "react-router-dom";

type ProfileBoardFriendsProps = {
  userId: string;
};

type Friend = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
};

type FriendData = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  birthday: string;
  email: string;
  phone: string;
  friends: string[];
  friend_requests_sent: string[];
  friend_requests_received: string[];
};

const ProfileBoardFriends: React.FC<ProfileBoardFriendsProps> = ({
  userId,
}) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError(`Invalid user ID`);
      setLoading(false);
      return;
    }

    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.FRIENDS(userId)}`,
        );
        if (!response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        const friends = data.friends;
        if (!Array.isArray(friends)) throw new Error("Invalid response data");

        const mappedFriends: Friend[] = friends.map((friend: FriendData) => ({
          id: friend.id,
          firstName: friend.first_name,
          lastName: friend.last_name,
          username: friend.username,
        }));

        setFriends(mappedFriends);
      } catch (error) {
        setError(`An error occurred: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [userId]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-3 p-4">
      {friends.map((friend) => (
        <FriendItem key={friend.id} {...friend} />
      ))}
    </div>
  );
};

const FriendItem: React.FC<Friend> = ({
  id,
  firstName,
  lastName,
  username,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center p-4">
      <img
        src={DefaultAvatar}
        alt="profile"
        className="w-12 h-12 rounded-full"
      ></img>
      <div className="p-4 hover:cursor-pointer" onClick={() => navigate(`/users/profile/${id}`)}>
        <h2 className="text-gray-700 dark:text-gray-300 text-xl">
          {firstName} {lastName}
        </h2>
        <p className="text-gray-500 dark:text-gray-500">@{username}</p>
      </div>
    </div>
  );
};

export default ProfileBoardFriends;
