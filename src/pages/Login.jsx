import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
// import Logo from "../images/AVlogo.jpeg"; // assuming this path is correct

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        { email, password },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const user = response.data.data.user;
      const token = response.data.data.token;

      if (user.user_type === "admin" || user.user_type === "Super Admin") {
        login(user, token);
        navigate("/dashboard");
      } else {
        setErrorMsg("Access denied. Only Admins can login.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Login failed. Please check your email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-white">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
        <img src="/AVlogo.jpeg" alt="Login Logo" className="w-32 mx-auto mb-4" />

        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Welcome Back!</h2>
          <p className="text-sm text-gray-500">Login to access your account</p>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 mb-3 text-sm bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 mb-2 text-sm bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mb-2 text-sm text-right text-gray-500 cursor-pointer hover:text-blue-500">
          Forgot password?
        </div>

        {errorMsg && (
          <p className="mb-3 text-sm text-red-500">{errorMsg}</p>
        )}

        <button
          onClick={handleLogin}
          className="block w-1/2 py-2 mx-auto text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
