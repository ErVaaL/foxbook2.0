import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Loader from "../Loader";
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

type Event = {
  id: string;
  attributes: {
    title: string;
    description: string;
    event_date: string;
    host: {
      id: string;
      username: string;
    };
    attendees: Array<{
      id: string;
      username: string;
    }>;
  };
};

type EventsComponentProps = {
  endpoint: string;
};

const EventsComponent: React.FC<EventsComponentProps> = ({ endpoint }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      if (![200, 202].includes(response.status))
        throw new Error("Failed to fetch events");

      setEvents(response.data.details.map((e: { data: Event }) => e.data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const formattedEvents = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.attributes.title,
        description: event.attributes.description,
        eventDate: new Date(event.attributes.event_date).toLocaleDateString(),
        hostUsername: event.attributes.host.username,
        attendeesCount: event.attributes.attendees.length,
      })),
    [events],
  );

  if (loading) return <Loader color="#4a90e2" size={60} />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!formattedEvents.length)
    return <p className="text-gray-500 dark:text-gray-400">No events found.</p>;

  return (
    <div className="space-y-4 p-4">
      {formattedEvents.map((event) => (
        <div
          key={event.id}
          className="p-2 rounded-lg w-full border border-gray-400 shadow"
        >
          <h3
            onClick={() => navigate(`/events/${event.id}`)}
            className="text-lg font-bold text-black dark:text-white hover:cursor-pointer"
          >
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {event.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Event Date: {event.eventDate}
          </p>
          <div className="flex items-center mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Host: {event.hostUsername}
            </p>
          </div>
          <div className="mt-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Attendees: {event.attendeesCount}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsComponent;
