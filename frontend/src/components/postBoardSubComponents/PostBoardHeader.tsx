import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import ListComponent from "./ListComponent";

export type SearchResult = {
  id: string;
  type: string;
  attributes: {
    id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    name?: string;
    description?: string;
    event_date?: string;
    title?: string;
    avatar?: string;
  };
};

const PostBoardHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [results, setResults] = useState<{
    users: SearchResult[];
    groups: SearchResult[];
    events: SearchResult[];
  }>({
    users: [],
    groups: [],
    events: [],
  });
  const [showResults, setShowResults] = useState<boolean>(false);
  const [noMatches, setNoMatches] = useState<boolean>(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setShowResults(false);
      setNoMatches(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`,
      );

      if (response.status === 404 || !response.data.results) {
        setResults({ users: [], groups: [], events: [] });
        setNoMatches(true);
        setShowResults(false);
        return;
      }

      const flattenedResults = {
        users: (response.data.results.users || [])
          .map((user: { data: SearchResult }) => (user.data ? user.data : null))
          .filter(Boolean),
        groups: (response.data.results.groups || [])
          .map((group: { data: SearchResult }) =>
            group.data ? group.data : null,
          )
          .filter(Boolean),
        events: (response.data.results.events || [])
          .map((event: { data: SearchResult }) =>
            event.data ? event.data : null,
          )
          .filter(Boolean),
      };

      setResults(flattenedResults);
      setNoMatches(false);
      setShowResults(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setResults({ users: [], groups: [], events: [] });
        setNoMatches(true);
      }
      setShowResults(false);
    }
  };

  const handleUserInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleSearch(e);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleFocus = () => {
    if (
      searchQuery.trim() &&
      (results.users.length ||
        results.groups.length ||
        results.events.length ||
        noMatches)
    ) {
      setShowResults(true);
    }
  };

  const closeResults = () => {
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        closeResults();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="p-4 flex justify-between items-center gap-3">
        <h2 className="dark:text-gray-300 p-2">Choose filter:</h2>
        <select
          value={filter}
          onChange={handleFilterChange}
          className="dark:bg-gray-600 rounded-lg p-2 dark:text-gray-300"
        >
          <option value="all">All</option>
          <option value="friends">Friends</option>
          <option value="groups">Groups</option>
          <option value="events">Events</option>
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={handleUserInput}
          onFocus={handleFocus}
          placeholder="Search friends, groups, or events..."
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-600 dark:text-gray-100"
        />
      </div>
      {showResults && !noMatches && (
        <div
          className="absolute z-50 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md max-h-64 overflow-y-auto"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ListComponent
            results={results}
            filter={filter}
            closeResults={closeResults}
          />
        </div>
      )}
      {noMatches && (
        <div className="absolute z-50 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md p-4">
          <p className="text-center text-gray-500 dark:text-gray-300">
            No matches found
          </p>
        </div>
      )}
    </div>
  );
};

export default PostBoardHeader;
