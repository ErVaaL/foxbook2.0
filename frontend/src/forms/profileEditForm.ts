import * as Yup from "yup";
import { snakeCase, mapKeys } from "lodash";
import { FormikHelpers } from "formik";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

export type ProfileEditFormValues = {
  firstName: string;
  lastName: string;
  username: string;
  description: string;
  birthday: string;
  email: string;
  phone: string;
  address: {
    country: string;
    state: string;
    city: string;
  };
};

export const initialValues: ProfileEditFormValues = {
  firstName: "",
  lastName: "",
  username: "",
  description: "",
  birthday: "",
  email: "",
  phone: "",
  address: {
    country: "",
    state: "",
    city: "",
  },
};

export const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .min(3, "First Name must be at least 3 characters"),
  lastName: Yup.string()
    .required("Last Name is required")
    .min(3, "Last Name must be at least 3 characters"),
  username: Yup.string().required("Username is required"),
  description: Yup.string().max(
    250,
    "Description cannot exceed 250 characters",
  ),
  birthday: Yup.date()
    .required("You can't unset your birthday")
    .max(new Date(), "Birthday cannot be in the future")
    .test("is-older-than-13", "You must be at least 13 years old", (value) => {
      const today = new Date();
      const thirteenYearsAgo = new Date(
        today.getFullYear() - 13,
        today.getMonth(),
        today.getDate(),
      );
      return value <= thirteenYearsAgo;
    }),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Phone number must contain only numbers")
    .required("Phone is required"),
  address: Yup.object().shape({
    country: Yup.string(),
    state: Yup.string(),
    city: Yup.string(),
  }),
});

const toSnakeCase = <T extends Record<string, unknown>>(
  obj: T,
): Record<string, unknown> =>
  mapKeys(obj, (_: unknown, key: string) => snakeCase(key));

export const handleSubmit = async (
  values: ProfileEditFormValues,
  { setSubmitting, setErrors }: FormikHelpers<ProfileEditFormValues>,
  userId: string,
  token: string,
  toggleEditing: () => void,
  onSuccess: (updatedValues: ProfileEditFormValues) => void,
) => {
  try {
    const userPayload = {
      user: toSnakeCase({
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        birthday: values.birthday,
        email: values.email,
        phone: values.phone,
      }),
    };

    const profilePayload = {
      profile: toSnakeCase({
        description: values.description,
        address: values.address,
      }),
    };

    const userResponse = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.USER_EDIT(userId)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      },
    );

    if (!userResponse.ok) throw new Error("Failed to update user");

    const profileResponse = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PROFILE(userId)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profilePayload),
      },
    );

    if (!profileResponse.ok) throw new Error("Failed to update profile");

    onSuccess(values);

    toggleEditing();
  } catch (error) {
    console.error(error);
    setErrors({ email: `An error occurred: ${error}` });
  } finally {
    setSubmitting(false);
  }
};
