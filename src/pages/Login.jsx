import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import SuperAdminChoiceModal from "../components/SuperAdminChoiceModal.jsx";
import { BASE_URL } from "../constants/BaseUrl.jsx";
// import Logo from "../images/AVlogo.jpeg"; // assuming this path is correct



const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showChoice, setShowChoice] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}api/login`,
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

      if (user.user_type === "admin" ) {
        login(user, token);
        navigate("/dashboard");
      } 
      else if (user.user_type === "accounts") {
      login(user, token);
      navigate("/accounts");
    }else if (user.user_type === "super admin") {
  login(user, token);
  navigate("/dashboard");
  // setShowChoice(true); 
} 
    else {
        setErrorMsg("Access denied. Only Admins and Account Officers can login.");
      }
    } catch (error) {
      console.error(error);
       // Handle specific error messages from backend
    if (error.response && error.response.data && error.response.data.message) {
      setErrorMsg(error.response.data.message);
    } else if (error.response && error.response.status === 403) {
      setErrorMsg("Your account has been deactivated. Please contact administrator.");
    } else {
      setErrorMsg("Login failed. Please check your email or password.");
    }
  }
};

  const handleChoice = (path) => {
  setShowChoice(false);
  navigate(path);
};

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: "url('/LoginBg.jpg')", 
        // backgroundImage: "linear-gradient(rgba(228, 228, 228, 0), rgba(20, 46, 101, 0.5)), url('/LoginBg.jpg')"
      }}
    >

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

<div 
  className="mb-2 text-sm text-right text-gray-500 cursor-pointer hover:text-blue-500"
  onClick={() => navigate("/forgot-password")}
>
  Forgot password?
</div>


        {errorMsg && (
          <p className="mb-3 text-sm text-red-500">{errorMsg}</p>
        )}

        <button
          onClick={handleLogin}
          className="block w-1/2 py-2 mx-auto mb-6 text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
        >
          Login
        </button>

        
      </div>
       {/* <SuperAdminChoiceModal open={showChoice} onClose={handleChoice} /> */}
    </div>
  );

};

export default LoginPage;
