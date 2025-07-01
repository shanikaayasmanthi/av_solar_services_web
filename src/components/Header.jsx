// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleClick = () => {
    navigate("/dueservice");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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