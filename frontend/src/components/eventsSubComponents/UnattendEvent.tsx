import React from "react";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Event } from "./AttendEvent";

type UnattendEventProps = {
  eventId: string;
  setEvent: React.Dispatch<React.SetStateAction<Event>>;
};

const UnattendEvent: React.FC<UnattendEventProps> = ({ eventId, setEvent }) => {
  const { token, userId } = useSelector((state: RootState) => state.auth);

  const handleUnattend = async () => {
    try {
      if (!token || !userId) throw new Error("User not logged in");
      await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.EVENT_UNATTEND(eventId, userId)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setEvent((prev: Event) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          attendees: prev.attributes.attendees?.filter(
            (attendee) => attendee.id !== userId,
          ),
        },
      }));
    } catch (error) {
      console.error("Error unattending event:", error);
    }
  };

  return (
    <button
      onClick={handleUnattend}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
    >
      Unattend Event
    </button>
  );
};

export default UnattendEvent;
