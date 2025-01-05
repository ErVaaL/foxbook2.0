import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  initialValues,
  validationSchema,
  handleSubmit,
  ProfileEditFormValues,
} from "../../forms/profileEditForm";

type ProfileEditProps = {
  toggleEditing: () => void;
  profile: ProfileEditFormValues;
  updatedProfile: (updatedValues: ProfileEditFormValues) => void;
};

const ProfileEdit: React.FC<ProfileEditProps> = ({
  toggleEditing,
  profile,
  updatedProfile,
}) => {
  const { token, userId } = useSelector((state: RootState) => state.auth);

  return (
    <div className="px-4 pt-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-300">
        Edit Profile
      </h2>
      <Formik
        initialValues={profile || initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) =>
          handleSubmit(
            values,
            formikHelpers,
            userId || "",
            token || "",
            toggleEditing,
            updatedProfile,
          )
        }
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <FieldGroup label="First Name" name="firstName" />
            <FieldGroup label="Last Name" name="lastName" />
            <FieldGroup label="Username" name="username" />
            <FieldGroup
              label="Description"
              name="description"
              component="textarea"
              placeholder="Say something about yourself max. 250 characters"
            />
            <FieldGroup label="Birthday" name="birthday" type="date" />
            <FieldGroup label="Email" name="email" type="email" />
            <FieldGroup label="Phone" name="phone" type="tel" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              Address
            </h3>
            <FieldGroup
              label="Country"
              name="address.country"
              placeholder="eg. Poland"
            />
            <FieldGroup
              label="State"
              name="address.state"
              placeholder="eg. Pomerania"
            />
            <FieldGroup
              label="City"
              name="address.city"
              placeholder="eg. Gdańsk"
            />
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700 dark:hover:bg-goldenrodhover dark:bg-darkgoldenrod text-white font-bold py-2 px-4 rounded"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white dark:bg-gray-300 dark:hover:bg-gray-400 dark:text-black py-2 px-4 rounded"
                onClick={toggleEditing}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

type FieldGroupProps = {
  label: string;
  name: string;
  type?: string;
  component?: string;
  placeholder?: string;
};

const FieldGroup: React.FC<FieldGroupProps> = ({
  label,
  name,
  type = "text",
  component = "input",
  placeholder,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <Field
      id={name}
      name={name}
      type={type}
      as={component}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded dark:bg-gray-600 dark:text-gray-100"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);

export default ProfileEdit;
