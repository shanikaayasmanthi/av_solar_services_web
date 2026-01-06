
import { useNavigate } from "react-router-dom";
import React, { useState,useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { BASE_URL } from "../constants/BaseUrl.jsx";


const Header = ({showNotification=true}) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, token, logout } = useAuth();

  const handleClick = () => {
    const currentNotificationIds = notifications.map(n => n.project_id).join(',');
    localStorage.setItem('seenNotificationIds', currentNotificationIds);
    setUnseenNotificationCount(0);
    navigate("/dueservice");
  };

  const logoutUser = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}api/logout`,
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

  const [notifications, setNotifications] = useState([]);
  const [unseenNotificationCount, setUnseenNotificationCount] = useState(0);

  useEffect(() => {
  const fetchNotificationCount = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/services/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
        if (response.data.status === 'success') {
          const newNotifications = response.data.notifications;
          setNotifications(newNotifications);
           // Get the seen notification IDs from localStorage
          const seenIdsStr = localStorage.getItem('seenNotificationIds') || '';
          const seenIds = seenIdsStr.split(',').filter(id => id !== '');
          
          // Calculate unseen notifications (those not in the seen list)
          const unseenNotifications = newNotifications.filter(
            notification => !seenIds.includes(notification.project_id.toString())
          );
          
          setUnseenNotificationCount(unseenNotifications.length);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

  fetchNotificationCount();
  
  // Set up interval for refreshing count
  const interval = setInterval(fetchNotificationCount, 300000);
  
  return () => clearInterval(interval);
}, [token]);

  const handleLogout = async() => {
    const logoutResponse = await logoutUser();
    if(logoutResponse==true){
      logout();
      navigate("/");
    }
  };
    const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate("/profile");
  };

  return (
    <header className="fixed top-0 left-0 z-50 flex items-center justify-between w-full h-[65px] px-4 md:px-6 lg:px-7 text-gray-800 bg-white shadow-md border-b border-gray-100">
        <img 
          src="/AVlogo.jpeg" 
          alt="Logo" 
          className="h-7 w-auto md:h-7 transition-all duration-300 hover:scale-105 cursor-pointer" 
          onClick={() => {
            if (user?.user_type === "admin" || user?.user_type === "super admin") {
              navigate('/dashboard');
            }
          }}
        />
      
      <div className="flex items-center gap-4 md:gap-6">
  {/* Notification button only for admin/super admin */}
  {showNotification && (user?.user_type === "admin" || user?.user_type === "super admin") && (
    <div 
      className="relative p-2 text-teal-600 cursor-pointer rounded-full transition-all duration-300 hover:bg-teal-50 hover:text-teal-700 hover:scale-110"
      onClick={handleClick}
    >
      <NotificationsActiveIcon fontSize="medium" className="md:text-2xl" />
      {unseenNotificationCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {unseenNotificationCount}
        </span>
      )}
    </div>
  )}

        <span className="hidden text-base font-medium text-gray-700 md:inline lg:text-md">
          Hi {user?.name ? <span className="font-semibold text-gray-700 ml-1">{user.name}</span> : "!"}
        </span>

        <div className="relative">
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className="cursor-pointer p-1.5 rounded-full transition-all duration-300 hover:bg-teal-50 hover:text-teal-700"
          >
            <AccountCircleIcon fontSize="large" className="text-teal-600" />
          </div>
          
          {dropdownOpen && (
            <div 
              className="absolute right-0 z-50 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fadeIn"
              onMouseLeave={() => setDropdownOpen(false)}
            >
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.name || "User"}</p>
              <p 
                className="text-xs text-gray-500 truncate cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleProfileClick}
              >
                {user?.email || ""}
              </p>
            </div>
            <button
              onClick={handleProfileClick}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors duration-200"
            >
              <PersonIcon fontSize="small" />
              <span>Profile</span>
            </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors duration-200"
              >
                <LogoutIcon fontSize="small" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;