import React, { useState, useEffect } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "../../../config";
import Loader from "../../Loader";
import { useNavigate } from "react-router-dom";

type ProfileBoardEventsProps = {
  userId: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  host: string;
  hostId: string;
};

type EventData = {
  data: {
    id: string;
    attributes: {
      title: string;
      description: string;
      event_date: string;
      host: {
        id: string;
        username: string;
      };
    };
  };
};

const ProfileBoardEvents: React.FC<ProfileBoardEventsProps> = ({ userId }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError(`Invalid user ID`);
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.USER_EVENTS(userId)}`,
        );
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        const events = data.events;

        if (!Array.isArray(events)) throw new Error("Invalid response data");

        const mappedEvents: Event[] = events.map((event: EventData) => ({
          id: event.data.id,
          title: event.data.attributes.title,
          description: event.data.attributes.description,
          eventDate: event.data.attributes.event_date,
          host: event.data.attributes.host.username,
          hostId: event.data.attributes.host.id,
        }));

        setEvents(mappedEvents);
      } catch (error) {
        setError(`An error occurred: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [userId]);

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="w-full p-4 m-0 text-center">
      {events.length ? (
        <div className="grid grid-cols-3 h-full gap-4 space-y-4">
          {events.map((event) => (
            <EventItem key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 place-self-center">
          No events to display
        </div>
      )}
    </div>
  );
};

const EventItem: React.FC<Event> = ({ id, title, eventDate, host, hostId }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-200 dark:bg-gray-700 shadow-md rounded-lg p-4 text-left">
      <h3 className="text-lg font-semibold dark:text-gray-200">Event: {title}</h3>
      <p className="text-gray-500 dark:text-gray-400">Time: {eventDate}</p>
      <p className="text-gray-500 dark:text-gray-400 hover:cursor-pointer" onClick={()=>navigate(`/users/profile/${hostId}`)}>Hosted by: {host}</p>
    </div>
  );
};

export default ProfileBoardEvents;
