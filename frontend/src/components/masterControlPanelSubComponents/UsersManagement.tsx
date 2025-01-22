import React from "react";
import { API_BASE_URL } from "../../config";
import axios from "axios";

const UsersManagement: React.FC = () => {
  export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async ({ page = 1 }: { page: number }, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/admin/users?page=${page}&per_page=10`,
        );
        return {
          users: response.data.users.data,
          totalPages: Math.ceil(response.data.meta.total_count / 10),
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(error.response?.data);
        }
      }
    },
  );
};

export default UsersManagement;
