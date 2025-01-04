import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/useAuthStore";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { login, isLoggedIn } = useAuthStore();
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

      const { user, token } = await response.json();
      login(user, token);
      navigate("/");
    } catch (error) {
      setError(`An error occurred. ${error}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 dark:bg-[#1e1e1e] transition-colors duration-200 ">
      {isLoggedIn ? (
        <div className="text-center">
          <h1 className="text-2xl mb-4 text-gray-800 dark:text-gray-200">
            You are already logged in!
          </h1>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-orange-600 hover:bg-orange-700 dark:bg-[#b8860b] dark:hover:bg-[#ae7c01] text-white py-2 px-4 rounded"
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
            className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-[#b8860b] dark:hover:bg-[#ae7c01] text-white py-2 rounded"
          >
            Log In
          </button>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-orange-600 hover:text-orange-700 dark:text-[#b8860b] dark:hover:text-[#ae7c01]"
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
