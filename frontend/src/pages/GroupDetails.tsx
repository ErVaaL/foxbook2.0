import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import Loader from "../components/Loader";
import UniversalHeader from "../components/universal/UniversalHeader";
import axios from "axios";
import UniversalBoard from "../components/universal/UniversalBoard";
import PostsComponent from "../components/universal/PostsComponent";
import EventsComponent from "../components/universal/EventsComponent";
import MembersComponent from "../components/groupsSubComponents/MembersComponent";

type Group = {
  id: string;
  attributes: {
    name: string;
    description: string;
    is_public: boolean;
    created_at: string;
    owner: {
      id: string;
      username: string;
      email: string;
    };
  };
};

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.GROUPS}/${id}`,
        );
        if (![200, 202].includes(response.status))
          throw new Error("Failed to fetch group");

        setGroup(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!group) return <p>Group not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-0 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      <UniversalHeader
        title={group.attributes.name}
        subtitle={`Owner: ${group.attributes.owner.username}`}
        additionalInfo={`Email: ${group.attributes.owner.email}`}
        metaInfo={[
          {
            label: "Visibility",
            value: group.attributes.is_public ? "Public" : "Private",
          },
          { label: "Description", value: group.attributes.description },
        ]}
      />
      <UniversalBoard
        sections={[
          {
            label: "Posts",
            component: (
              <PostsComponent
                endpoint={`${API_ENDPOINTS.GROUP_POSTS(group.id)}`}
              />
            ),
          },
          {
            label: "Events",
            component: (
              <EventsComponent
                endpoint={`${API_ENDPOINTS.GROUP_EVENTS(group.id)}`}
              />
            ),
          },
          {
            label: "Members",
            component: (
              <MembersComponent
                endpoint={`${API_ENDPOINTS.GROUP_MEMBERS(group.id)}`}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default GroupDetails;
