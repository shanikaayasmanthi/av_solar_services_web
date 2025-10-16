import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants/BaseUrl";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // const handleForgot = async () => {
  //   try {
  //     const res = await axios.post(`${BASE_URL}api/forgot-password`, { email });
  //     setMessage(res.data.message + " | Token: " + res.data.reset_token); // dev only
  //   } catch (err) {
  //     setMessage(err.response?.data?.message || "Error sending reset link");
  //   }
  // };
  const handleForgot = async () => {
  try {
    const res = await axios.post(`${BASE_URL}api/forgot-password`, { email });
    const token = res.data.reset_token;

    // navigate to reset-password page with token & email
    navigate(`/reset-password?token=${token}&email=${email}`);
  } catch (err) {
    setMessage(err.response?.data?.message || "Error sending reset link");
  }
};

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleForgot}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Send Reset Link
      </button>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
