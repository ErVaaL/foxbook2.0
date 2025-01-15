import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader";
import { API_BASE_URL } from "../../config";

type ResponseArray = {
  data: Member[];
};

type Member = {
  id: string;
  attributes: {
    role: string;
    created_at: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
};

type MembersComponentProps = {
  endpoint: string;
};

const MembersComponent: React.FC<MembersComponentProps> = ({ endpoint }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        if (![200, 202].includes(response.status))
          throw new Error("Failed to fetch members");

        setMembers(response.data.details.map((m: ResponseArray) => m.data));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [endpoint]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!members.length)
    return (
      <p className="text-gray-500 dark:text-gray-400">No members found.</p>
    );

    //TODO Adjust css

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="border p-4 rounded shadow-sm bg-white dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-black dark:text-white">
              {member.attributes.user.username}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {member.attributes.role}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Email: {member.attributes.user.email}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-300">
            Joined on: {new Date(member.attributes.created_at).toLocaleDateString("en-UK")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MembersComponent;
