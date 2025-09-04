import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleServiceModel from '../components/ScheduleServiceModel';

const DueService = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/services/notifications',
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.status === 'success') {
        const allNotifications = response.data.notifications;
        setNotifications(allNotifications);
        setTotalPages(Math.ceil(allNotifications.length / 6)); // 6 per page
        setCurrentPage(1);
      } else {
        setError('Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up interval for refreshing notifications
    const interval = setInterval(() => {
      fetchNotifications();
    }, 300000); // Refresh every 5 minutes
    
    return () => clearInterval(interval);
  }, [token]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleScheduleClick = (projectId) => {
    setSelectedProjectId(projectId);
    setScheduleModal(true);
  };

  const handleCloseModal = () => {
    setScheduleModal(false);
    setSelectedProjectId(null);
  };

  return (
    <div className="origin-top-left scale-[0.75] w-[133.33%]">
      <div className="origin-top-left w-full">
        <div className="relative mx-auto">
          {/* Header Section */}
          <div className="flex gap-2 items-start mb-6">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-3xl font-bold text-gray-800">
                Due Service Notifications
              </h1>
                            <div
                className="bg-teal-600 hover:bg-teal-700 rounded-md p-2 text-white shadow-md transition-colors hover:scale-105 cursor-pointer"
                onClick={fetchNotifications}
                disabled={loading}
              >
                <RefreshIcon fontSize="medium" />
              </div>
            </div>
          </div>

          {/* Content Section */}
        
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg relative mb-6 shadow-sm">
              <span className="block sm:inline font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="absolute top-2 right-2 p-1 text-red-800 hover:text-red-600 transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-600 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-lg font-medium">No due service notifications at this time.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">
                  You have {notifications.length} due service{notifications.length !== 1 ? 's' : ''}
                </h2>
              </div>

              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {notifications
                  .slice((currentPage - 1) * 6, currentPage * 6) // show only 6 per page
                  .map((notification, index) => (

                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 bg-white shadow-lg "
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {notification.project_name}
                        </h3>
                        <div className="mt-3 space-y-2">
                          <p className="text-md font-semibold text-gray-700">
                            <span className="font-medium font-bold text-gray-900">Project No:</span> {notification.project_no}
                          </p>
                          <p className="text-md text-red-600 font-medium">
                            <span className="font-medium text-gray-900">Due Date:</span> {formatDate(notification.due_date)}
                          </p>
                          <p className="text-md font-semibold text-gray-700">
                            <span className="font-medium text-gray-900">Due Service Round:</span> {notification.due_service_round}
                          </p>
                        </div>
                      </div>

                      <div 
                        className="bg-teal-500 text-white rounded-lg px-3 py-2 cursor-pointer hover:bg-teal-600 hover:scale-105 transition-all duration-200 ml-4 focus:outline-none focus:ring-2 focus:ring-teal-400" 
                        onClick={() => handleScheduleClick(notification.project_id)}
                      >
                        <CalendarMonthIcon fontSize='medium' />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}


        </div>
                          {/* Pagination */}
        <div className="flex justify-end mt-10">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 text-white bg-teal-500 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-2 py-2 font-semibold">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-2 mx-1 text-white bg-teal-500 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Schedule Service Modal */}
      {scheduleModal && (
        <ScheduleServiceModel 
          show={scheduleModal} 
          onClose={handleCloseModal} 
          projectId={selectedProjectId} 
        />
      )}
    </div>
  );
};

export default DueService;