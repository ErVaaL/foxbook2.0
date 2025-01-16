import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import Loader from "../components/Loader";
import UniversalHeader from "../components/universal/UniversalHeader";
import UniversalBoard from "../components/universal/UniversalBoard";
import InviteModal from "../components/universal/InviteModal";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import JoinGroup from "../components/groupsSubComponents/JoinGroup";
import LeaveGroup from "../components/groupsSubComponents/LeaveGroup";
import GroupCreation from "../forms/GroupCreation";

const PostsComponent = React.lazy(
  () => import("../components/universal/PostsComponent"),
);
const EventsComponent = React.lazy(
  () => import("../components/universal/EventsComponent"),
);
const MembersComponent = React.lazy(
  () => import("../components/groupsSubComponents/MembersComponent"),
);

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
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { isLoggedIn, userId, token } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const fetchUserRole = useCallback(async () => {
    if (!id || !userId) return;

    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.GROUP_IS_MEMBER(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (![200, 202].includes(response.status))
        throw new Error("Failed to fetch group members");

      const memberData = response.data.details.data;
      setUserRole(memberData ? memberData.attributes.role : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [id, token, userId]);

  const fetchGroup = useCallback(async () => {
    if (!id) {
      setError("Invalid group ID");
      setLoading(false);
      return;
    }

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
  }, [id]);

  useEffect(() => {
    if (isLoggedIn) fetchUserRole();
    fetchGroup();
  }, [fetchGroup, fetchUserRole, isLoggedIn]);

  const sections = useMemo(() => {
    if (!group) return [];
    return [
      {
        label: "Posts",
        component: (
          <PostsComponent endpoint={`${API_ENDPOINTS.GROUP_POSTS(group.id)}`} />
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
    ];
  }, [group]);

  const canEditGroup = useMemo(() => {
    if (!group || !isLoggedIn || !userRole) return false;
    return (
      ["owner", "admin"].includes(userRole) ||
      userId === group.attributes.owner.id
    );
  }, [group, isLoggedIn, userRole, userId]);

  const canInviteFriends = useMemo(() => {
    if (!group || !isLoggedIn || !userRole) return false;
    return group.attributes.is_public || ["owner", "admin"].includes(userRole);
  }, [group, isLoggedIn, userRole]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!group) return <p>Group not found</p>;

  const renderActions = () => {
    if (!isLoggedIn) return null;

    return (
      <div className="flex space-x-3">
        {canEditGroup && (
          <button
            onClick={toggleEditing}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Edit Group
          </button>
        )}

        {userRole === null && (
          <JoinGroup
            refreshGroupData={() => {
              fetchGroup();
              fetchUserRole();
            }}
          />
        )}

        {userRole !== null && userId !== group.attributes.owner.id && (
          <LeaveGroup
            refreshGroupData={() => {
              fetchGroup();
              fetchUserRole();
            }}
          />
        )}

        {canInviteFriends && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover text-white rounded"
          >
            Invite Friend
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-0 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      {!isEditing ? (
        <>
          <UniversalHeader
            title={group.attributes.name}
            subtitle={`Owner: ${group.attributes.owner.username}`}
            additionalInfo={`Email: ${group.attributes.owner.email}`}
            description={group.attributes.description}
            metaInfo={[
              {
                label: "Visibility",
                value: group.attributes.is_public ? "Public" : "Private",
              },
            ]}
            actions={renderActions()}
          />
          <UniversalBoard sections={sections} />
        </>
      ) : (
        <GroupCreation />
      )}

      {showInviteModal && (
        <InviteModal
          groupId={group.id}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

export default GroupDetails;
