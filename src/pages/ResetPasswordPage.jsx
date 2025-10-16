// import React, { useState } from "react";
// import axios from "axios";
// import { BASE_URL } from "../constants/BaseUrl";

// const ResetPasswordPage = () => {
//   const [email, setEmail] = useState("");
//   const [token, setToken] = useState(""); // will be sent via email in real app
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleReset = async () => {
//     try {
//       const res = await axios.post(`${BASE_URL}api/reset-password`, {
//         email,
//         token,
//         password,
//         password_confirmation: confirmPassword,
//       });
//       setMessage(res.data.message);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Reset failed");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
//       <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
//       <input
//         type="email"
//         placeholder="Your Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="w-full p-2 border rounded mb-2"
//       />
//       <input
//         type="text"
//         placeholder="Reset Token"
//         value={token}
//         onChange={(e) => setToken(e.target.value)}
//         className="w-full p-2 border rounded mb-2"
//       />
//       <input
//         type="password"
//         placeholder="New Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full p-2 border rounded mb-2"
//       />
//       <input
//         type="password"
//         placeholder="Confirm New Password"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         className="w-full p-2 border rounded mb-2"
//       />
//       <button
//         onClick={handleReset}
//         className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//       >
//         Reset Password
//       </button>
//       {message && <p className="mt-4 text-sm">{message}</p>}
//     </div>
//   );
// };

// export default ResetPasswordPage;
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants/BaseUrl";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      const res = await axios.post(`${BASE_URL}api/reset-password`, {
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });

      setMessage(res.data.message);
      // after success, redirect to login
      navigate("/");
    } catch (err) {
      if (err.response?.data?.errors) {
        setMessage(Object.values(err.response.data.errors).flat().join(", "));
      } else {
        setMessage(err.response?.data?.message || "Error resetting password");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleReset}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Reset Password
      </button>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;

