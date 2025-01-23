import React from "react";
import { useEvents } from "../../contexts/masterControlContext/subMasterContext/MasterEventsContext";
import EventsTable from "./tables/EventsTable";
import Loader from "../Loader";

const EventsManagement: React.FC = () => {
  const { state, editItem, deleteItem } = useEvents();
  const { data: events, loading, error } = state;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center py-2">
        Manage Events
      </h2>

      {loading && <Loader size={60} />}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && events.length > 0 && (
        <EventsTable
          data={events}
          editItem={editItem}
          deleteItem={deleteItem}
        />
      )}

      {!loading && !error && events.length === 0 && (
        <p className="text-gray-600">No events found</p>
      )}
    </div>
  );
};

export default EventsManagement;
