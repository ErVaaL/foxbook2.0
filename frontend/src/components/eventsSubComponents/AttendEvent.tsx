import React from "react";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export interface Event {
  id: string;
  attributes: {
    attendees: { id: string; username: string }[];
  };
}

type AttendEventProps = {
  eventId: string;
  setEvent: React.Dispatch<React.SetStateAction<Event>>;
};

const AttendEvent: React.FC<AttendEventProps> = ({ eventId, setEvent }) => {
  const { token, userId } = useSelector((state: RootState) => state.auth);

  const handleAttend = async () => {
    try {
      if (!userId || !token) throw new Error("User not logged in");
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.EVENT_ATTEND(eventId)}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setEvent((prev: Event) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          attendees: [
            ...(prev.attributes.attendees || []),
            { id: userId, username: "You" },
          ],
        },
      }));
    } catch (error) {
      console.error("Error attending event:", error);
    }
  };

  return (
    <button
      onClick={handleAttend}
      className="px-4 py-2 bg-orange-500 dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover hover:bg-orange-600 text-white rounded"
    >
      Attend Event
    </button>
  );
};

export default AttendEvent;
