import React, { useEffect, useState } from "react";
import Loader from "../../Loader";
import { API_BASE_URL, API_ENDPOINTS } from "../../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";

type ProfileBoardGroupsProps = {
  userId: string;
};

type Group = {
  id: string;
  attributes: {
    name: string;
    description: string;
    is_public: boolean;
  };
};

const ProfileBoardGroups: React.FC<ProfileBoardGroupsProps> = ({ userId }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!userId) {
      setError(`Invalid user ID`);
      setLoading(false);
      return;
    }

    const fetchGroups = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.USER_GROUPS(userId)}`,
          { headers },
        );
        if (response.status !== 200)
          throw new Error(`Error fetching groups: ${response}`);
        setGroups(
          response.data.groups.map((group: { data: Group }) => group.data),
        );
      } catch (error) {
        setError(`An error occurred: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [token, userId]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="w-full p-4 m-0 text-center">
      {groups.length ? (
        <div className="grid grid-cols-3 h-full gap-4 ">
          {groups.map((group) => (
            <GroupItem key={group.id} {...group} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 place-self-center">
          <p>User is not in any public groups</p>
        </div>
      )}
    </div>
  );
};

const GroupItem: React.FC<Group> = ({
  id,
  attributes: { name, is_public },
}) => {
  const navigate = useNavigate();
  return (
    <div
      key={id}
      onClick={() => navigate(`/groups/${id}`)}
      className="border rounded-lg border-gray-500 p-4 hover:cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-300">
        {name}
        {!is_public && <span className="text-sm text-gray-500">(Private)</span>}
      </h3>
    </div>
  );
};

export default ProfileBoardGroups;
