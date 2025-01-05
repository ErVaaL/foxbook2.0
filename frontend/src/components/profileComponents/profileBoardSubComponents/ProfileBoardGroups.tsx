import React, { useEffect, useState } from "react";
import Loader from "../../Loader";
import { API_BASE_URL, API_ENDPOINTS } from "../../../config";

type ProfileBoardGroupsProps = {
  userId: string;
};

type Group = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
};

const ProfileBoardGroups: React.FC<ProfileBoardGroupsProps> = ({ userId }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError(`Invalid user ID`);
      setLoading(false);
      return;
    }

    const fetchGroups = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.USER_GROUPS(userId)}`,
        );
        if (!response.ok) throw new Error("Failed to fetch groups");
        const data = await response.json();
        const groups = data.groups;
        if (!Array.isArray(groups)) throw new Error("Invalid response data");
        setGroups(groups);
      } catch (error) {
        setError(`An error occurred: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [userId]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="w-full p-4 m-0 text-center">
      {groups.filter((group) => group.isPublic).length ? (
        <div className="grid grid-cols-3 h-full gap-4 space-y-4">
          {groups.map(
            (group) =>
              group.isPublic && <GroupItem key={group.id} {...group} />,
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 place-self-center">
          <p>User is not in any public groups</p>
        </div>
      )}
    </div>
  );
};

const GroupItem: React.FC<Group> = ({ id, name, description }) => {
  return (
    <div key={id} className="bg-white dark:bg-gray-800 p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default ProfileBoardGroups;
