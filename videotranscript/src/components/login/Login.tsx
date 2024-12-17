import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      console.log(response);
      
      const { token, role, username: loggedInUsername } = response.data;

    login(token, role, loggedInUsername); 
      token ? navigate("/") : navigate("/login");
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid username or password");
    }
  };

  return (
      <main className="flex flex-1 items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className={`bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-sm ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <h2 className="text-center text-2xl font-bold mb-4">Welcome Back</h2>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
          >
            Login
          </button>
          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <span className="text-blue-500 hover:underline cursor-pointer dark:text-blue-400">
              Sign Up
            </span>
          </p>
        </form>
      </main>
  );
};

export default Login;
