import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
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
  privacy: "public" | "private" | "friends_only";
  isFriend: boolean;
};

const DEFAULT_PROFILE_AVATAR = DefaultAvatar;

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const {
    userId: loggedInUserId,
    token,
    user,
  } = useSelector((state: RootState) => state.auth);

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
        setError("Invalid user ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.PROFILE(userId)}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        const attributes = data.details?.data?.attributes;
        if (!attributes) throw new Error("Invalid response data");

        const user = attributes.user;
        const mappedProfile: UserProfile = {
          userId,
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
          avatarUrl: user.avatar || DEFAULT_PROFILE_AVATAR,
          posts: [],
          privacy: attributes.privacy ?? "public",
          isFriend: attributes.isFriend ?? false,
        };

        setProfile(mappedProfile);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (!profile) return <p>Profile not found</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const isOwner = loggedInUserId === profile.userId;
  const isFriend = user?.friends?.includes(profile.userId) ?? false;

  const canViewFullProfile =
    profile.privacy === "public" ||
    isOwner ||
    (profile.privacy === "friends_only" && isFriend);

  return (
    <div className="max-w-5xl flex flex-col mx-auto p-0 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      {!isEditing ? (
        <>
          <ProfileHeader
            profileUserId={profile.userId}
            firstName={profile.firstName}
            lastName={profile.lastName}
            username={profile.username}
            avatarUrl={profile?.avatarUrl || DEFAULT_PROFILE_AVATAR}
            toggleEditing={toggleEditing}
            privacy={profile.privacy}
            isFriend={profile.isFriend}
          />

          {canViewFullProfile ? (
            <ProfileBoard
              email={profile.email}
              phone={profile.phone}
              birthday={profile.birthday}
              address={profile.address}
              privacy={"public"}
              isFriend={false}
              isOwner={false}
            />
          ) : (
            <div className="text-center text-gray-700 dark:text-gray-300">
              <p>This profile is private.</p>
            </div>
          )}
        </>
      ) : (
        <ProfileEdit
          toggleEditing={toggleEditing}
          profile={profile}
          updatedProfile={updateProfile}
        />
      )}
    </div>
  );
};

export default Profile;
