import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  initialValues,
  validationSchema,
  onSubmit,
} from "../forms/registerFormikConfig";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, helpers) => onSubmit(values, helpers, navigate),
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 dark:bg-[#1e1e1e] transition-colors duration-200">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white dark:bg-[#1a1a1a] p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl mb-6 text-center text-gray-800 dark:text-gray-200">
          Register
        </h1>
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...formik.getFieldProps("firstName")}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="text-red-500">{formik.errors.firstName}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            {...formik.getFieldProps("lastName")}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <p className="text-red-500">{formik.errors.lastName}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps("email")}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500">{formik.errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="birthday"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Birthday
          </label>
          <input
            id="birthday"
            type="date"
            {...formik.getFieldProps("birthday")}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {formik.touched.birthday && formik.errors.birthday && (
            <p className="text-red-500">{formik.errors.birthday}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            {...formik.getFieldProps("username")}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-red-500">{formik.errors.username}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            {...formik.getFieldProps("phone")}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500">{formik.errors.phone}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...formik.getFieldProps("password")}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500">{formik.errors.password}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="passwordConfirmation"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Confirm Password
          </label>
          <input
            id="passwordConfirmation"
            type="password"
            {...formik.getFieldProps("passwordConfirmation")}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          {formik.touched.passwordConfirmation &&
            formik.errors.passwordConfirmation && (
              <p className="text-red-500">
                {formik.errors.passwordConfirmation}
              </p>
            )}
        </div>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover text-white py-2 rounded"
        >
          Register
        </button>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-orange-600 hover:text-orange-700 dark:text-darkgoldenrod dark:hover:text-goldenrodhover hover:cursor-pointer"
          >
            Log In
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
