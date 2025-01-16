import React from "react";
import { SearchResult } from "./PostBoardHeader";
import { useNavigate } from "react-router-dom";

const ListComponent: React.FC<{
  results: {
    users: SearchResult[];
    groups: SearchResult[];
    events: SearchResult[];
  };
  filter: string;
  closeResults: () => void;
}> = ({ results, filter, closeResults }) => {
  const navigate = useNavigate();
  const filteredResults = () => {
    switch (filter) {
      case "friends":
        return results.users;
      case "groups":
        return results.groups;
      case "events":
        return results.events;
      default:
        return [...results.users, ...results.groups, ...results.events].filter(
          (result) => result,
        );
    }
  };

  const handleNavigate = (id: string, item: string) => {
    closeResults();
    switch (item) {
      case "users":
        navigate(`/users/profile/${id}`);
        break;
      case "groups":
        navigate(`/groups/${id}`);
        break;
      case "events":
        navigate(`/events/${id}`);
        break;
      default:
        break;
    }
  };

  const renderResultItem = (result: SearchResult) => {
    const attributes = result.attributes;

    if (attributes.username) {
      return (
        <div
          key={result.id}
          onClick={() => handleNavigate(result.id, "users")}
          className="p-2 flex items-center gap-3 hover:cursor-pointer hover:bg-gray-300 rounded-lg dark:text-gray-300 dark:hover:text-gray-900"
        >
          <img
            src={attributes.avatar || "/src/assets/default-profile.png"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <p>
            {attributes.first_name} {attributes.last_name} (@
            {attributes.username})
          </p>
        </div>
      );
    } else if (attributes.name && attributes.description) {
      return (
        <div
          key={result.id}
          onClick={() => handleNavigate(result.id, "groups")}
          className="p-2 flex items-center gap-3 hover:cursor-pointer hover:bg-gray-300 rounded-lg dark:text-gray-300 dark:hover:text-gray-900"
        >
          <p className="font-bold">[G] {attributes.name}</p>
        </div>
      );
    } else if (attributes.event_date) {
      return (
        <div
          key={result.id}
          onClick={() => handleNavigate(result.id, "events")}
          className="p-2 flex items-center gap-3 hover:cursor-pointer hover:bg-gray-300 rounded-lg dark:text-gray-300 dark:hover:text-gray-900"
        >
          <p className="font-bold">[E] {attributes.title}</p>
          <p>{attributes.event_date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4">
      {filteredResults().length ? (
        filteredResults().map((result) => renderResultItem(result))
      ) : (
        <p className="p-2 dark:text-gray-300">No results found</p>
      )}
    </div>
  );
};

export default ListComponent;
