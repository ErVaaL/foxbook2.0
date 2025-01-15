import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader";
import { API_BASE_URL } from "../../config";

//TODO Adjust event structure and response from backend

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

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        if (![200, 202].includes(response.status))
          throw new Error("Failed to fetch events");

        setEvents(response.data.details.map((e: Event) => e.attributes));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [endpoint]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!events.length)
    return <p className="text-gray-500 dark:text-gray-400">No events found.</p>;

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="border p-4 rounded shadow-sm bg-white dark:bg-gray-800"
        >
          <h3 className="text-lg font-bold text-black dark:text-white">
            {event.attributes.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {event.attributes.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Event Date:{" "}
            {new Date(event.attributes.event_date).toLocaleDateString()}
          </p>
          <div className="flex items-center mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Host: {event.attributes.host.username}
            </p>
          </div>
          {event.attributes.attendees.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Attendees:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                {event.attributes.attendees.map((attendee) => (
                  <li key={attendee.id}>{attendee.username}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventsComponent;
