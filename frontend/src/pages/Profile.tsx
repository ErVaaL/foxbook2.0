import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultAvatar from "../assets/default-profile.png";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import Loader from "../components/Loader";
import ProfileHeader from "../components/profileComponents/ProfileHeader";
import ProfileBoard from "../components/profileComponents/ProfileBoard";
import ProfileEdit from "../components/profileComponents/ProfileEdit";
import { ProfileEditFormValues } from "../forms/profileEditForm";

type Address = {
  country: string;
  state: string;
  city: string;
};

type UserProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  birthday: string;
  phone: string;
  description: string;
  address: Address;
  avatarUrl: string | null;
  posts: Array<{ id: string; title: string; content: string }>;
};

const DEFAULT_PROFILE_AVATAR = DefaultAvatar;

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const updateProfile = (updatedValues: ProfileEditFormValues) => {
    if (!profile) return;
    setProfile((prev) => ({ ...prev!, ...updatedValues }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError(`Invalid user ID`);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.PROFILE(userId)}`,
        );
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        const attributes = data.details?.data?.attributes;
        if (!attributes) throw new Error("Invalid response data");

        const user = attributes.user;
        const mappedProfile: UserProfile = {
          userId: userId,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          email: user.email,
          birthday: user.birthday,
          phone: user.phone,
          description: attributes.description,
          address: {
            country: attributes.address.country,
            state: attributes.address.state,
            city: attributes.address.city,
          },
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

    fetchProfile();
  }, [userId]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (!profile) return <p>Profile not found</p>;
  if (error) return <p>An error occurred. {error}</p>;

  return (
    <div className="max-w-5xl flex flex-col mx-auto p-0 min-h-screen h-full bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      {!isEditing ? (
        <>
          <ProfileHeader
            profileUserId={profile.userId}
            firstName={profile.firstName}
            lastName={profile.lastName}
            username={profile.username}
            toggleEditing={toggleEditing}
            avatarUrl={profile?.avatarUrl || DEFAULT_PROFILE_AVATAR}
          />
          <ProfileBoard posts={profile.posts} />
        </>
      ) : (
        <ProfileEdit toggleEditing={toggleEditing} profile={profile} updatedProfile={updateProfile} />
      )}
    </div>
  );
};

export default Profile;
