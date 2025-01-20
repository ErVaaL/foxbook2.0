import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchUserData, login } from "../store/authSlice";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            email: email,
            password: password,
          },
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.error || "Invalid credentials");
        return;
      }

      const { token } = await response.json();
      dispatch(login({ token }));
      await dispatch(fetchUserData(token));
      navigate("/");
    } catch (error) {
      setError(`An error occurred. ${error}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 dark:bg-[#1e1e1e] transition-colors duration-200">
      {isLoggedIn ? (
        <div className="text-center">
          <h1 className="text-2xl mb-4 text-gray-800 dark:text-gray-200">
            You are already logged in!
          </h1>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-orange-600 hover:bg-orange-700 dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover text-white py-2 px-4 rounded"
          >
            Go to Home
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#1a1a1a] p-8 rounded-lg shadow-md w-96"
        >
          <h1 className="text-2xl mb-6 text-center text-gray-800 dark:text-gray-200">
            Login
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-darkgoldenrod dark:hover:bg-goldenrodhover text-white py-2 rounded"
          >
            Log In
          </button>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <a
              onClick={() => navigate("/register")}
              className="text-orange-600 hover:text-orange-700 dark:text-darkgoldenrod dark:hover:text-goldenrodhover hover:cursor-pointer"
            >
              Sign Up
            </a>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
