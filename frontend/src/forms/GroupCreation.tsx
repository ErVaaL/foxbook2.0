import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type GroupCreationProps = {
  initialValues?: GroupFormValues;
  onSubmit?: (values: GroupFormValues) => void;
};

export type GroupFormValues = {
  name: string;
  description: string;
  is_public: boolean;
};

const GroupCreation: React.FC<GroupCreationProps> = ({
  initialValues = { name: "", description: "", is_public: true },
  onSubmit,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

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
      if (onSubmit) {
        onSubmit(values);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.GROUPS}`,
        {
          group: values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status !== 201) throw new Error("Failed to create group");

      console.log("Group created successfully!");
      navigate(`/groups`);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-200">
        {initialValues.name ? "Edit Group" : "Create Group"}
      </h2>
      <Formik
        initialValues={initialValues}
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
                placeholder="Enter group name"
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
                rows={4}
                className="w-full p-2 border rounded"
                placeholder="Enter group description (max 300 characters)"
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
                className="h-5 w-5 rounded border-gray-300 focus:ring-0 checked:bg-orange-500 
               dark:checked:bg-darkgoldenrod"
              />
              <label htmlFor="is_public" className="text-sm dark:text-gray-300">
                Public Group
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-darkgoldenrod text-white rounded dark:hover:bg-goldenrodhover"
            >
              {isSubmitting
                ? "Saving..."
                : initialValues.name
                  ? "Save Group"
                  : "Create Group"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GroupCreation;
