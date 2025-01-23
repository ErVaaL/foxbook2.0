import { useReducer, useEffect } from "react";
import axios from "axios";
import { AdminUserFromAPI } from "../types/userTypes";
import { AdminGroupFromAPI } from "../types/groupTypes";
import { AdminEventFromAPI } from "../types/eventTypes";

interface Identifiable {
  id: string;
}

interface CrudState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

type CrudAction<T> =
  | { type: "SET_DATA"; payload: T[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const crudReducer = <T extends Identifiable>(
  state: CrudState<T>,
  action: CrudAction<T>,
): CrudState<T> => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload, loading: false, error: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const useCrudOperations = <T extends Identifiable>(
  endpoint: string,
  token: string | null,
  type?: "posts" | "events" | "groups",
) => {
  const initialState: CrudState<T> = { data: [], loading: false, error: null };
  const [state, dispatch] = useReducer(crudReducer<T>, initialState);

  const extractData = (response: any): T[] => {
    switch (type) {
      case "posts":
      case "events":
        return (
          response.data?.[type]?.data?.map((item: AdminEventFromAPI) => ({
            id: item.id,
            ...item.attributes,
          })) || []
        );

      case "groups":
        return (
          response.data?.groups?.data?.map((group: AdminGroupFromAPI) => ({
            id: group.id,
            ...group.attributes,
          })) || []
        );

      default:
        return (
          response.data?.users?.data?.map((user: AdminUserFromAPI) => ({
            id: user.id,
            ...user.attributes,
          })) || []
        );
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      let url = endpoint;
      if (type !== "groups" && type !== undefined) {
        url = `${endpoint}?type=${type}`;
      }

      try {
        const response = await axios.get(url, { headers });
        dispatch({ type: "SET_DATA", payload: extractData(response) });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          dispatch({
            type: "SET_ERROR",
            payload: error.response?.data?.message || "Failed to fetch data",
          });
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, token, type]);

  const editItem = async (id: string, updatedData: Partial<T>) => {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(updatedData).filter(
          ([, value]) => value !== "" && value !== undefined,
        ),
      );

      if (Object.keys(filteredData).length === 0) {
        console.warn("No valid data provided for update.");
        return;
      }

      const url = type ? `${endpoint}/${id}?type=${type}` : `${endpoint}/${id}`;
      const payload = { [type || "user"]: filteredData };

      let confirmationUrl;
      switch (type) {
        case "events":
          confirmationUrl = `${endpoint}?type=${type}`;
          break;
        default:
          confirmationUrl = `${endpoint}`;
      }

      await axios.patch(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await axios.get(confirmationUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({ type: "SET_DATA", payload: extractData(response) });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch({
          type: "SET_ERROR",
          payload: error.response?.data?.message || "Failed to update data",
        });
      }
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const url = type ? `${endpoint}/${id}?type=${type}` : `${endpoint}/${id}`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({
        type: "SET_DATA",
        payload: state.data.filter((item) => item.id !== id),
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch({
          type: "SET_ERROR",
          payload: error.response?.data?.message || "Failed to delete data",
        });
      }
    }
  };

  return { state, editItem, deleteItem };
};
