import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Loader from "../Loader";
import { API_BASE_URL } from "../../config";
import MemberCard from "./MemberCard";

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

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      if (![200, 202].includes(response.status))
        throw new Error("Failed to fetch members");

      setMembers(response.data.details.map((m: { data: Member }) => m.data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const formattedMembers = useMemo(
    () =>
      members.map((member) => ({
        id: member.id,
        username: member.attributes.user.username,
        email: member.attributes.user.email,
        role: member.attributes.role,
        userId: member.attributes.user.id,
        joinedDate: new Date(member.attributes.created_at).toLocaleDateString(
          "en-UK",
        ),
      })),
    [members],
  );

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!formattedMembers.length)
    return (
      <p className="text-gray-500 dark:text-gray-400">No members found.</p>
    );

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-center dark:text-gray-300">
        All members: {formattedMembers.length}
      </h3>
      {formattedMembers.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};

export default MembersComponent;
