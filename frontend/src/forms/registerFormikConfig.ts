import * as Yup from "yup";
import { snakeCase, mapKeys } from "lodash";
import { API_BASE_URL, API_ENDPOINTS } from "../config";
import { FormikHelpers } from "formik";

const toSnakeCase = <T extends Record<string, unknown>>(
  obj: T,
): Record<string, unknown> =>
  mapKeys(obj, (_: unknown, key: string) => snakeCase(key));

export const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  birthday: "",
  username: "",
  phone: "",
  password: "",
  passwordConfirmation: "",
};

export const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  birthday: Yup.date().required("Birthday is required"),
  username: Yup.string().required("Username is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Phone must contain only numbers")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
});

export const onSubmit = async (
  values: Record<string, unknown>,
  { setSubmitting, setErrors }: FormikHelpers<Record<string, unknown>>,
  navigate: (path: string) => void,
) => {
  try {
    const payload = {
      user: toSnakeCase(values),
    };

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      setErrors({ email: errorResponse.error || "Registration failed" });
      if (errorResponse.details) {
        setErrors({ email: errorResponse.details.join(", ") });
      }
      return;
    }

    navigate("/login");
  } catch (error) {
    setErrors({ email: `An error occurred: ${error}` });
  } finally {
    setSubmitting(false);
  }
};
