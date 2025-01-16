import React, { useCallback, useEffect, useMemo, useState } from "react";
import UniversalHeader from "../components/universal/UniversalHeader";
import UniversalBoard from "../components/universal/UniversalBoard";
import { FixedSizeGrid as Grid, GridChildComponentProps } from "react-window";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import Loader from "../components/Loader";
import DefaultAvatar from "../assets/default-profile.png";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import AttendEvent from "../components/eventsSubComponents/AttendEvent";
import UnattendEvent from "../components/eventsSubComponents/UnattendEvent";
import EventCreation from "../forms/EventCreation";

const DEFAULT_AVATAR = DefaultAvatar;

type UserFragment = {
  id: string;
  avatar?: string;
  username: string;
};

type EventData = {
  id: string;
  attributes: {
    title: string;
    created_at: string;
    description: string;
    event_date: string;
    host: UserFragment;
    attendees?: UserFragment[];
  };
};

const Event: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useSelector((state: RootState) => state.auth);

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const fetchEvent = useCallback(async () => {
    try {
      if (!id) throw new Error("No event ID provided");
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.EVENT(id)}`,
      );

      if (response.status !== 200) throw new Error("Failed to fetch event");
      if (!response.data.data) throw new Error("Event not found");

      setEvent(response.data.data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refreshEvent = () => {
    setLoading(true);
    fetchEvent();
  };

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const renderGridItem = useCallback(
    ({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
      if (!event?.attributes.attendees) return null;
      const index = rowIndex * 4 + columnIndex;
      const attendee = event.attributes.attendees[index];
      if (!attendee) return null;

      return (
        <div
          style={style}
          onClick={() => navigate(`/users/profile/${attendee.id}`)}
          className="flex flex-col items-center p-2 hover:cursor-pointer"
        >
          <img
            src={attendee.avatar || DEFAULT_AVATAR}
            alt={attendee.username}
            className="w-16 h-16 rounded-full border dark:border-gray-500"
          />
          <span className="text-gray-600 dark:text-gray-300">
            {attendee.username}
            {attendee.id === event.attributes.host.id && " (Host)"}
            {attendee.id === userId && " (You)"}
          </span>
        </div>
      );
    },
    [event?.attributes.attendees, event?.attributes.host.id, navigate, userId],
  );

  const isAttending = useMemo(() => {
    return event?.attributes.attendees?.some(
      (attendee) => attendee.id === userId,
    );
  }, [event, userId]);

  const canEditEvent = useMemo(() => {
    return isLoggedIn && userId === event?.attributes.host.id;
  }, [isLoggedIn, userId, event]);

  const sections = useMemo(() => {
    const attendees = event?.attributes.attendees ?? [];

    return [
      {
        label: "Details",
        component: (
          <div className="space-y-2 p-2">
            <h2 className="text-lg font-bold dark:text-white text-center pb-4">
              Event Details
            </h2>
            <p
              onClick={() =>
                navigate(`/users/profile/${event?.attributes.host.id}`)
              }
              className="text-gray-700 dark:text-gray-400 hover:cursor-pointer"
            >
              Hosted by: @{event?.attributes.host.username}
            </p>
            <p className="text-gray-700 dark:text-gray-400">
              Happens at:{" "}
              {event
                ? new Date(event.attributes.event_date).toLocaleDateString()
                : ""}
            </p>
            <p className="text-gray-700 dark:text-gray-400">
              Created on:{" "}
              {event
                ? new Date(event.attributes.created_at).toLocaleDateString()
                : ""}
            </p>
          </div>
        ),
      },
      {
        label: "Attendees",
        component:
          attendees.length > 0 ? (
            <Grid
              columnCount={4}
              columnWidth={200}
              height={300}
              rowCount={Math.ceil(attendees.length / 4)}
              rowHeight={200}
              width={800}
            >
              {renderGridItem}
            </Grid>
          ) : (
            <p className="text-gray-700 dark:text-gray-400 p-2 text-center">
              No attendees yet
            </p>
          ),
      },
    ];
  }, [event, navigate, renderGridItem]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!event) return <p className="text-red-500">Event not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-0 min-h-screen bg-gray-300 dark:bg-[#242424] transition-colors duration-200">
      {!isEditing ? (
        <>
          <UniversalHeader
            title={event.attributes.title}
            additionalInfo={`Date: ${new Date(event.attributes.event_date).toLocaleDateString()}`}
            description={event.attributes.description}
            actions={
              <>
                {isLoggedIn && userId !== event.attributes.host.id && (
                  <>
                    {isAttending ? (
                      <UnattendEvent eventId={event.id} setEvent={setEvent} />
                    ) : (
                      <AttendEvent eventId={event.id} setEvent={setEvent} />
                    )}
                  </>
                )}
                {canEditEvent && (
                  <button
                    onClick={toggleEditing}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover text-white rounded"
                  >
                    Edit Event
                  </button>
                )}
              </>
            }
          />
          <UniversalBoard sections={sections} />
        </>
      ) : (
        <EventCreation
          toggleEditing={toggleEditing}
          refreshEvent={refreshEvent}
        />
      )}
    </div>
  );
};

export default Event;
