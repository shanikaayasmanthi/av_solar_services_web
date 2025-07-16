// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user,token, logout } = useAuth();

  const handleClick = () => {
    navigate("/dueservice");
  };

  const logoutUser = async () => {
  // console.log("Token from AuthContext:", token);

  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/logout',
      {},
      {  
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    console.log("Logout Response Data:", response.data);

    if (response.data.status === "Request was successful.") {
      console.log("Logout successful");
      return true;
    } else {
      console.warn("Logout successful, but unexpected status:", response.data.status);
      return false;
    }
  } catch (error) {
    console.error("Error logging out:", error);
    if (error.response) {
      console.error("Server responded with:", error.response.status, error.response.data);
      if (error.response.status === 401) {
        console.error("Authentication failed: Token invalid or missing from header.");
      }
    } else if (error.request) {
      console.error("No response received from server. Network issue or CORS preflight failure.");
    } else {
      console.error("Error setting up request:", error.message);
    }
    return false;
  }
};
  const handleLogout = async() => {
    const logoutResponse = await logoutUser();
    if(logoutResponse==true){
      logout();
    navigate("/");
    }
    
  };

  return (
    <header className="fixed top-0 left-0 z-50 flex items-center justify-between w-full h-20 px-5 text-gray-800 bg-white shadow-md">
      <img src="/AVlogo.jpeg" alt="Logo" className="h-auto w-36" />
      <div className="flex items-center gap-4">
        <div className="text-2xl text-gray-800 cursor-pointer" onClick={handleClick}>
          <NotificationsActiveIcon />
        </div>

        <span className="hidden text-base font-medium sm:inline">
          Hi{user?.name ? `! ${user.name}` : "!"}
        </span>

        <div className="relative">
          <div onClick={() => setDropdownOpen(!dropdownOpen)} className="cursor-pointer">
            <AccountCircleIcon fontSize="large" />
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 z-50 p-2 mt-2 text-sm bg-white border border-gray-300 shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;