import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../store";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

export type EventFormValues = {
  title: string;
  description: string;
  event_date: string;
};

const EventCreation: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(5, "Title must be at least 5 characters")
      .max(50, "Title must not exceed 50 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(200, "Description must not exceed 200 characters"),
    event_date: Yup.date()
      .required("Event date is required")
      .min(
        new Date(new Date().setDate(new Date().getDate() + 1)),
        "Event date must be at least 1 day in the future",
      ),
  });

  const handleSubmit = async (values: EventFormValues) => {
    try {
      const url = isEditing
        ? `${API_BASE_URL}${API_ENDPOINTS.EVENTS}/${id}`
        : `${API_BASE_URL}${API_ENDPOINTS.EVENTS}`;

      const method = isEditing ? "PATCH" : "POST";

      const response = await axios({
        method,
        url,
        data: { event: values },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (![202, 201].includes(response.status)) {
        throw new Error(
          isEditing ? "Failed to update event" : "Failed to create event",
        );
      }

      setSuccessMessage(
        isEditing
          ? "Event updated successfully!"
          : "Event created successfully!",
      );

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error(
        isEditing ? "Error updating event:" : "Error creating event:",
        error,
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-200">
        {isEditing ? "Edit Event" : "Create Event"}
      </h2>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          {successMessage}
        </div>
      )}

      <Formik
        initialValues={{ title: "", description: "", event_date: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium dark:text-gray-300"
              >
                Event Title
              </label>
              <Field
                id="title"
                name="title"
                className="w-full p-2 border rounded"
                placeholder="Enter event title"
              />
              <ErrorMessage
                name="title"
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
                placeholder="Enter event description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="event_date"
                className="block text-sm font-medium dark:text-gray-300"
              >
                Event Date
              </label>
              <Field
                id="event_date"
                name="event_date"
                type="date"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="event_date"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-darkgoldenrod text-white rounded dark:hover:bg-goldenrodhover"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Save Event"
                    : "Create Event"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-red-500 hover:bg-red-800 text-white rounded"
              >
                Go Back
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EventCreation;
