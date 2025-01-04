import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import ProfileBoard from "../components/profileComponents/ProfileBoard";
import ProfileHeader from "../components/profileComponents/ProfileHeader";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import DefaultAvatar from "../assets/default-profile.png";

type UserProfile = {
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string | null;
  posts: Array<{ id: string; title: string; content: string }>;
};

const DEFAULT_PROFILE_AVATAR = DefaultAvatar;

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !token) {
        setError(`Invalid user ID or token`);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.PROFILE(userId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        const attributes = data.details?.data?.attributes;
        if (!attributes) throw new Error("Invalid response data");

        const user = attributes.user;
        const mappedProfile: UserProfile = {
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          avatarUrl: null,
          posts: [],
        };
        setProfile(mappedProfile);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchProfile();
    }
  }, [token, userId]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (!profile) return <p>Profile not found</p>;
  if (error) return <p>An error occurred. {error}</p>;

  return (
    <div className="max-w-5xl flex flex-col mx-auto p-0 min-h-screen h-full bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      <ProfileHeader
        firstName={profile.firstName}
        lastName={profile.lastName}
        username={profile.username}
        avatarUrl={profile?.avatarUrl || DEFAULT_PROFILE_AVATAR}
      />
      <ProfileBoard posts={profile.posts} />
    </div>
  );
};

export default Profile;
