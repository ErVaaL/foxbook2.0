import React, { useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "../../config";
import axios from "axios";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

type JoinGroupProps = {
  refreshGroupData: () => void;
};

const JoinGroup: React.FC<JoinGroupProps> = ({ refreshGroupData }) => {
  const { id } = useParams<{ id: string }>();
  const { userId, token } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState<boolean>(false);

  const joinGroup = async () => {
    setLoading(true);
    try {
      if (!userId) throw new Error("User not logged in");
      if (!id) throw new Error("Invalid group ID");
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.GROUP_JOIN(id)}`,
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (![200, 201].includes(response.status))
        throw new Error("Failed to join group");
      setJoined(true);

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
      {!joined ? (
        <button
          onClick={joinGroup}
          disabled={loading}
          className={`px-4 py-2 text-white rounded transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover"
          }`}
        >
          {loading ? "Joining..." : "Join Group"}
        </button>
      ) : (
        <p className="text-green-500 font-bold">
          Successfully joined the group!
        </p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

export default JoinGroup;
