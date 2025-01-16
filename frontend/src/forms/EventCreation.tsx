import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../store";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import Loader from "../components/Loader";

export type EventFormValues = {
  title: string;
  description: string;
  event_date: string;
};

type EventCreationProps = {
  toggleEditing?: () => void;
  refreshEvent?: () => void;
};

const EventCreation: React.FC<EventCreationProps> = ({
  toggleEditing,
  refreshEvent,
}) => {
  const { token, userId } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hostId, setHostId] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<EventFormValues>({
    title: "",
    description: "",
    event_date: "",
  });
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!isEditing || !id) return;

    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.EVENT(id)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.status !== 200) throw new Error("Failed to fetch event");

        const eventData = response.data.data.data.attributes;
        setInitialValues({
          title: eventData.title,
          description: eventData.description,
          event_date: new Date(eventData.event_date)
            .toISOString()
            .split("T")[0],
        });

        setHostId(eventData.host.id);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Error fetching event data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, isEditing, token]);

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
        ? `${API_BASE_URL}${API_ENDPOINTS.EVENT(id)}`
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

      setTimeout(() => {
        if (isEditing) {
          toggleEditing?.();
          refreshEvent?.();
        } else {
          navigate(`/events/${response.data.data.data.id}`);
        }
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error saving event",
      );
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.EVENT(id)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status !== 204) throw new Error("Failed to delete event");

      setSuccessMessage("Event deleted successfully!");
      setTimeout(() => {
        navigate("/events");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error deleting event",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loader color="#4a90e2" size={60} />;

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
                onClick={() =>
                  isEditing ? toggleEditing?.() : navigate("/events")
                }
                className="px-4 py-2 bg-gray-700 hover:bg-gray-900 text-white rounded"
              >
                {isEditing ? "Cancel" : "Go Back"}
              </button>

              {isEditing && userId === hostId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500 hover:bg-red-800 text-white rounded"
                >
                  {isDeleting ? "Deleting..." : "Delete Event"}
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EventCreation;
