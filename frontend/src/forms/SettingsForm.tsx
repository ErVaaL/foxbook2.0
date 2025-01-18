import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

interface SettingsFormValues {
  theme: "light" | "dark";
  notifications: boolean;
  privacy: "public" | "private" | "friends_only";
}

type SettingsFormProps = {
  onSubmit: (values: SettingsFormValues) => Promise<boolean>;
  initialValues: SettingsFormValues;
};

const SettingsForm: React.FC<SettingsFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | null;
  }>({
    text: "",
    type: null,
  });

  const validationSchema = Yup.object({
    theme: Yup.string().oneOf(["light", "dark"]).required("Theme is required"),
    notifications: Yup.boolean(),
    privacy: Yup.string()
      .oneOf(["public", "private", "friends_only"])
      .required("Privacy setting is required"),
  });

  const navigate = useNavigate();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        const success = await onSubmit(values);

        if (success) {
          setMessage({
            text: "Settings updated successfully!",
            type: "success",
          });
        } else {
          setMessage({
            text: "Failed to update settings. Try again.",
            type: "error",
          });
        }
        setSubmitting(false);
      }}
    >
      {({ dirty, isSubmitting }) => (
        <Form className="space-y-4">
          {message.text && (
            <div
              className={`p-2 rounded text-center ${
                message.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <Field
              as="select"
              name="theme"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-600 dark:text-gray-100"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Field>
          </div>

          <div className="flex items-center">
            <Field type="checkbox" name="notifications" className="mr-2" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Notifications
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile privacy
            </label>
            <Field
              as="select"
              name="privacy"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-600 dark:text-gray-100"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="friends_only">Friends Only</option>
            </Field>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={!dirty || isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover hover:cursor-pointer text-white py-2 px-4 rounded"
            >
              {isSubmitting ? "Applying..." : "Apply"}
            </button>

            <button
              type="reset"
              onClick={() => navigate("/")}
              className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded hover:cursor-pointer"
            >
              Leave
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SettingsForm;
