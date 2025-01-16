import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../store";
import Loader from "../components/Loader";

export type GroupFormValues = {
  name: string;
  description: string;
  is_public: boolean;
};

type GroupCreationProps = {
  toggleEditing?: () => void;
  refreshGroup?: () => void;
};

const GroupCreation: React.FC<GroupCreationProps> = ({
  toggleEditing,
  refreshGroup,
}) => {
  const { token, userId } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<GroupFormValues>({
    name: "",
    description: "",
    is_public: true,
  });
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!isEditing || !id) return;

    const fetchGroup = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.GROUPS}/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.status !== 200) throw new Error("Failed to fetch group");

        const groupData = response.data.data.attributes;
        setInitialValues({
          name: groupData.name,
          description: groupData.description,
          is_public: groupData.is_public,
        });

        setOwnerId(groupData.owner.id);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Error fetching group data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id, isEditing, token]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Group name is required")
      .min(3, "Group name must be at least 3 characters")
      .max(30, "Group name must not exceed 30 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(300, "Description must not exceed 300 characters"),
    is_public: Yup.boolean(),
  });

  const handleSubmit = async (values: GroupFormValues) => {
    try {
      const url = isEditing
        ? `${API_BASE_URL}${API_ENDPOINTS.GROUPS}/${id}`
        : `${API_BASE_URL}${API_ENDPOINTS.GROUPS}`;

      const method = isEditing ? "PATCH" : "POST";

      const response = await axios({
        method,
        url,
        data: { group: values },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (![202, 201].includes(response.status)) {
        throw new Error(
          isEditing ? "Failed to update group" : "Failed to create group",
        );
      }

      setSuccessMessage(
        isEditing
          ? "Group updated successfully!"
          : "Group created successfully!",
      );

      setTimeout(() => {
        if (isEditing) {
          toggleEditing?.();
          refreshGroup?.();
        } else {
          navigate(`/groups/${response.data.data.data.id}`);
        }
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error saving group",
      );
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.GROUPS}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status !== 204) throw new Error("Failed to delete group");

      setSuccessMessage("Group deleted successfully!");
      setTimeout(() => {
        navigate("/groups");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error deleting group",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loader color="#4a90e2" size={60} />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-200">
        {isEditing ? "Edit Group" : "Create Group"}
      </h2>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium dark:text-gray-300"
              >
                Group Name
              </label>
              <Field
                id="name"
                name="name"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium dark:text-gray-300"
              >
                Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Field
                id="is_public"
                name="is_public"
                type="checkbox"
                className="h-5 w-5"
              />
              <label htmlFor="is_public" className="text-sm dark:text-gray-300">
                Public Group
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover text-white rounded"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Save Group"
                    : "Create Group"}
              </button>

              <button
                type="button"
                onClick={() =>
                  isEditing ? toggleEditing?.() : navigate("/groups")
                }
                className="px-4 py-2 bg-gray-700 hover:bg-gray-900 text-white rounded"
              >
                {isEditing ? "Cancel" : "Go Back"}
              </button>

              {isEditing && userId === ownerId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500 hover:bg-red-800 text-white rounded"
                >
                  {isDeleting ? "Deleting..." : "Delete Group"}
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GroupCreation;
