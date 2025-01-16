import React, { useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import axios from "axios";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

type LeaveGroupProps = {
  refreshGroupData: () => void;
};

const LeaveGroup: React.FC<LeaveGroupProps> = ({ refreshGroupData }) => {
  const { id } = useParams<{ id: string }>();
  const { userId, token } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState<boolean>(false);

  const leaveGroup = async () => {
    setLoading(true);
    try {
      if (!userId) throw new Error("User not logged in");
      if (!id) throw new Error("Invalid group ID");

      const response = await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.GROUP_LEAVE(id, userId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (![204, 202].includes(response.status))
        throw new Error("Failed to leave group");

      setLeft(true);

      setTimeout(() => {
        refreshGroupData();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!left ? (
        <button
          onClick={leaveGroup}
          disabled={loading}
          className={`px-4 py-2 text-white rounded transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 dark:bg-darkred dark:hover:bg-red-700"
          }`}
        >
          {loading ? "Leaving..." : "Leave Group"}
        </button>
      ) : (
        <p className="text-red-500 font-bold">Successfully left the group!</p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

export default LeaveGroup;
