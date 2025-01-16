import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import { useDebouncedCallback } from "use-debounce";
import { FixedSizeGrid as Grid } from "react-window";
import Loader from "../Loader";
import GroupCard from "./GroupCard";
import { useNavigate } from "react-router-dom";

interface Group {
  id: string;
  attributes: {
    name: string;
    description: string;
    is_public: boolean;
    created_at: string;
    owner: {
      id: string;
      username: string;
      email: string;
    };
  };
}

const GroupsBoardBody: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const itemsPerPage = 12;

  //TODO when user is member of group show it with (private) tag next to name
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.GROUPS}`,
        );
        if (response.data.success === false)
          throw new Error(`Error fetching groups: ${response}`);
        setGroups(
          response.data.details
            .map((group: Group) => group.data)
            .filter((group: Group) => group.attributes.is_public),
        );
      } catch (error) {
        setError(`Error fetching groups: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const currentGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    return groups.slice(startIndex, endIndex);
  }, [groups, currentPage, itemsPerPage]);

  const debouncedSetPage = useDebouncedCallback((page: number) => {
    setCurrentPage(page);
  }, 200);

  return (
    <div className="flex flex-col min-h-max p-4">
      <div className="w-full flex justify-center items-center">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Grid
            columnCount={3}
            columnWidth={300}
            height={500}
            rowCount={Math.ceil(currentGroups.length / 3)}
            rowHeight={150}
            width={900}
          >
            {({ columnIndex, rowIndex, style }) => {
              const index = rowIndex * 3 + columnIndex;
              const group = currentGroups[index];
              if (!group) return null;

              return (
                <div
                  style={style}
                  onClick={() => navigate(`/groups/${group.id}`)}
                  className="justify-center items-center p-2 hover:cursor-pointer"
                >
                  <GroupCard group={group} />
                </div>
              );
            }}
          </Grid>
        )}
      </div>

      {groups.length > itemsPerPage && (
        <div className="flex justify-center space-x-4 mt-4 p-4">
          <button
            disabled={currentPage === 1}
            onClick={() => debouncedSetPage(Math.max(currentPage - 1, 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
          >
            Previous
          </button>
          <button
            disabled={currentPage * itemsPerPage >= groups.length}
            onClick={() => debouncedSetPage(currentPage + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupsBoardBody;
