import React, { useEffect, useState, useRef } from "react";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/16/solid";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export default function ScheduleServiceModel({ show, onClose, projectId }) {
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const { token } = useAuth();
  const [nextServiceRound, setNextServiceRound] = useState(0);
  const [assigner, setAssigner] = useState("");
  const [assignerId, setAssignerId] = useState(0);
  const [date, setDate] = useState(formatDate(new Date()));
  const [assignerSuggestions, setAssignerSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionTimeoutRef = useRef(null);
  const assignerInputRef = useRef(null);
  const suggestionListRef = useRef(null);
  const [serviceRoundError, setServiceRoundError] = useState("");
  const [assignerError, setAssignerError] = useState("");
  const [dateError, setDateError] = useState("");
  const [apiError, setApiError] = useState("");
  if (!show) return null;

  //get the next service round no
  const getNextServiceRound = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/get-next-service-round",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            project_id: projectId,
          },
        }
      );
      if (response.status === 200) {
        const responseData = response.data.data;
        setNextServiceRound(responseData.next_service_round);
      } else {
        console.log("No service rounds found for this project.");
        // return 0;
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        if (
          error.response.data.message ===
          "Service for this round already exists"
        ) {
          setNextServiceRound(0);
          setServiceRoundError("Invalid Service round, already exists");
        } else if (
          error.response.data.message === "Already have a service to complete"
        ) {
          setNextServiceRound(0);
          setServiceRoundError("Already have a service to complete");
        }
      }
      // console.error("Error getting next service round:", error);
      // setServiceRoundError('Error getting next service round');
      // return 0;
    }
  };

  useEffect(() => {
    getNextServiceRound();
  }, [projectId]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    // console.log(projectId,nextServiceRound, assignerId, date);

    try {
      if (nextServiceRound === 0 || nextServiceRound === null) {
        setServiceRoundError("Required valid Service round");
        return;
      }

      if (assignerId == 0 || assigner.trim() === "") {
        setAssignerError("Required a valid Supervisor");
        return;
      }

      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setDateError("Service Date cannot be in the past.");
        hasError = true;
        return;
      }
      const response = await axios.post(
        "http://127.0.0.1:8000/api/schedule-next-service",
        {
          project_id: projectId,
          service_round: nextServiceRound,
          supervisor_id: assignerId,
          service_date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data.data;

        onClose();
        console.log("Service scheduled successfully:", responseData);
      } else {
        console.error("Failed to schedule service:", response.data.message);
        return;
      }
      console.log("clicked");
    } catch (error) {
      setApiError("Failed to schedule service. Please try again.");
      console.error("Error in handleOnSubmit:", error);
      return;
    }
  };

  //get assigners
  const fetchAssignerSuggestions = async (query) => {
    if (!query.trim()) {
      setAssignerSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/search-supervisors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            query: query,
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data.data.supervisors;
        setAssignerSuggestions(responseData);
        setShowSuggestions(true);
      } else {
        setAssignerSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching assigner suggestions:", error);
      setAssignerSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleAssignerChange = (e) => {
    setAssignerError("");
    const value = e.target.value;
    setAssigner(value);

    // Debounce the API call
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }
    suggestionTimeoutRef.current = setTimeout(() => {
      fetchAssignerSuggestions(value);
    }, 300);
  };

  const handleAssignerSelect = (selectedAssigner) => {
    setAssigner(selectedAssigner.name);
    setAssignerId(selectedAssigner.id);
    setAssignerSuggestions([]); // Clear suggestions
    setShowSuggestions(false); // Hide the dropdown
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        assignerInputRef.current &&
        !assignerInputRef.current.contains(event.target) &&
        suggestionListRef.current &&
        !suggestionListRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  return (
    <div>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
        onClick={onClose}
      >
        {/* Modal Content */}

        <div
          className="bg-white p-6 rounded-xl w-[90%] max-w-[500px] shadow-lg relative
                   md:p-8" // padding: 24px 32px; equivalent (p-6 is 24px, p-8 is 32px)
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <span
            className="absolute top-2.5 right-4 text-2xl cursor-pointer" // top: 10px; right: 15px; (Tailwind approx)
            onClick={onClose}
          >
            &times;
          </span>

          {/* Topic 1 - Header with Print Icon and Title */}
          <div className="flex items-center mb-5 gap-7">
            <div className="text-gray-700">
              <CalendarDaysIcon className="w-6 h-6" />{" "}
            </div>
            <h3 className="m-0 text-xl font-semibold">Schedule Next Service</h3>{" "}
          </div>
          <div className="flex flex-col gap-4 ml-5">
            {/* Service Round */}
            <div className="flex flex-row flex-wrap items-center justify-between round">
              <span className="mb-1 text-sm">Service round</span>{" "}
              <div>
                <input
                  name="round"
                  type="text"
                  placeholder="Service round"
                  value={nextServiceRound}
                  onChange={(v) => {
                    setNextServiceRound(v.target.value);
                    setServiceRoundError("");
                  }}
                  className={`p-2 text-sm border-none rounded-md w-[300px] bg-gray-100 focus:outline-none focus:ring-2 ${
                    serviceRoundError
                      ? "border-red-500 ring-red-500"
                      : "focus:ring-gray-300"
                  } `}
                />
                {serviceRoundError && (
                  <p className="mt-1 text-xs text-red-600">
                    {serviceRoundError}
                  </p>
                )}
              </div>
            </div>
            {/* Assigner */}
            <div className="flex flex-row flex-wrap items-center justify-between assigner">
              <span className="mb-1 text-sm">Assigner</span>
              <div className="relative w-[300px]">
                <input
                  name="assigner"
                  type="text"
                  placeholder="assigner"
                  value={assigner}
                  onChange={handleAssignerChange}
                  onFocus={() =>
                    assigner.trim() &&
                    setAssignerSuggestions.length > 0 &&
                    setShowSuggestions(true)
                  }
                  ref={assignerInputRef}
                  className={`p-2 text-sm border-none rounded-md w-[300px] bg-gray-100 focus:outline-none focus:ring-2 ${
                    assignerError
                      ? "border-red-500 ring-red-500"
                      : "focus:ring-gray-300"
                  }`}
                />
                {assignerError && (
                  <p className="mt-1 text-xs text-red-600">{assignerError}</p>
                )}
                {showSuggestions && assignerSuggestions.length > 0 && (
                  <ul
                    ref={suggestionListRef}
                    className="absolute left-0 z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg top-full max-h-40"
                  >
                    {assignerSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 text-gray-800 cursor-pointer hover:bg-blue-100"
                        onClick={() => handleAssignerSelect(suggestion)}
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Date */}
            <div className="flex flex-row flex-wrap items-center justify-between date">
              <span className="mb-1 text-sm">Date</span>
              <div>
                <input
                  name="date"
                  type="date" // Changed to type="date" for date input functionality
                  placeholder="mm/dd/yyyy"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setDateError("");
                  }}
                  className={`p-2 text-sm border-none rounded-md w-[300px] bg-gray-100 focus:outline-none focus:ring-2 ${
                    assignerError
                      ? "border-red-500 ring-red-500"
                      : "focus:ring-gray-300"
                  }`}
                />
                {dateError && (
                  <p className="mt-1 text-xs text-red-600">{dateError}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            {apiError && (
              <p className="mt-1 text-xs text-red-600">{apiError}</p>
            )}
          </div>

          {/* Schedule Button */}
          <button
            className="button2 mt-3 bg-blue-600 text-white py-2.5 px-5 border-none rounded-lg cursor-pointer block ml-6 font-medium transition-colors duration-300 ease-in-out hover:bg-blue-500
                     md:ml-[25%] md:w-1/2 md:text-center md:text-sm" // margin-top: 20px; padding: 10px 20px; border-radius: 10px; margin-left: 25px;
            onClick={handleOnSubmit}
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
