import { useReducer, useEffect } from "react";
import axios from "axios";
import { AdminUserFromAPI } from "../types/userTypes";

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

const crudReducer = <T>(
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
) => {
  const initialState: CrudState<T> = { data: [], loading: false, error: null };
  const [state, dispatch] = useReducer(crudReducer<T>, initialState);

  useEffect(() => {
    if (!token) {
      console.warn("Token not available yet, waiting...");
      return;
    }
    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      const header = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const response = await axios.get(endpoint, {
          headers: header,
        });
        const responseData: T[] =
          response.data?.users?.data?.map((user: AdminUserFromAPI) => ({
            id: user.id,
            ...user.attributes,
          })) || [];
        dispatch({ type: "SET_DATA", payload: responseData });
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
  }, [endpoint, token]);

  const editItem = async (id: string, updatedData: Partial<T>) => {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(updatedData).filter(
          ([key, value]) => value !== "" && value !== undefined,
        ),
      );

      if (Object.keys(filteredData).length === 0) {
        console.warn("No valid data provided for update.");
        return;
      }

      const payload = { user: filteredData };

      await axios.patch(`${endpoint}/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUsers = response.data.users.data.map(
        (user: AdminUserFromAPI) => ({
          id: user.id,
          ...user.attributes,
        }),
      );

      dispatch({ type: "SET_DATA", payload: updatedUsers });
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
      await axios.delete(`${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
