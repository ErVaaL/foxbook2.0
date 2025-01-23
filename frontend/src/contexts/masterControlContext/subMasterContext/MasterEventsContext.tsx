import React, { createContext, ReactNode, useContext } from "react";
import { useCrudOperations } from "../../../hooks/useCrudOperations";
import { API_BASE_URL, API_ENDPOINTS } from "../../../config";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  created_at: string;
  host: HostDetails;
  attendees: Attendee[];
}

interface HostDetails {
  id: string;
  username: string;
  avatar: string;
}

interface Attendee {
  id: string;
  username: string;
  avatar: string;
}

interface EventsState {
  data: Event[];
  loading: boolean;
  error: string | null;
}

interface EventsContextType {
  state: EventsState;
  editItem: (id: string, updatedData: Partial<Event>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

const MasterEventsContext = createContext<EventsContextType | undefined>(
  undefined,
);

export const EventsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);

  const { state, editItem, deleteItem } = useCrudOperations<Event>(
    `${API_BASE_URL}${API_ENDPOINTS.ADMIN_CONTENT}`,
    token,
    "events",
  );

  return (
    <MasterEventsContext.Provider value={{ state, editItem, deleteItem }}>
      {children}
    </MasterEventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(MasterEventsContext);
  if (!context) {
    throw new Error("useEvents must be used within a EventsProvider");
  }
  return context;
};
