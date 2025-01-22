import { useReducer, useEffect } from "react";
import axios from "axios";

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

export const useCrudOperations = <T>(endpoint: string) => {
  const initialState: CrudState<T> = { data: [], loading: false, error: null };
  const [state, dispatch] = useReducer(crudReducer<T>, initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await axios.get(endpoint);
        dispatch({ type: "SET_DATA", payload: response.data });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          dispatch({
            type: "SET_ERROR",
            payload: error.response?.data.message || "Failed to fetch data",
          });
        }
      }
    };
    fetchData();
  }, [endpoint]);

  const editItem = async (id: string, updatedData: Partial<T>) => {
    try {
      await axios.put(`${endpoint}/${id}`, updatedData);
      dispatch({
        type: "SET_DATA",
        payload: state.data.map((item) =>
          item["id"] === id ? { ...item, ...updatedData } : item,
        ),
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch({
          type: "SET_ERROR",
          payload: error.response?.data.message || "Failed to update data",
        });
      }
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await axios.delete(`${endpoint}/${id}`);
      dispatch({
        type: "SET_DATA",
        payload: state.data.filter((item) => item["id"] !== id),
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch({
          type: "SET_ERROR",
          payload: error.response?.data.message || "Failed to delete data",
        });
      }
    }
  };

  return { state, editItem, deleteItem };
};
