import React, { useState, useEffect } from "react";
import SolarProjectRow from "../components/SolarProjectRow";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import AddModel from "../components/AddModel";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/BaseUrl.jsx";

export default function SolarProjects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [externalSubTab, setExternalSubTab] = useState("All");
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const { token } = useAuth();
  const [showAddModel, setShowAddModel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to fetch projects
  const fetchProjects = async (pageNumber = 1, tab = activeTab) => {
    // console.log("Current tab for fetch:", tab);

    try {
      let apiUrl = `${BASE_URL}api/get-projects`;
      let params = {
        page: pageNumber,
        query: searchQuery,
        per_page: itemsPerPage,
        is_hold: 0, // Exclude hold projects
      };

      // Determine which API endpoint to call
      if (tab === "external") {
        apiUrl = `${BASE_URL}api/external-projects`;
        // Add external sub-tab filter if not 'All'
        if (externalSubTab !== "All") {
          params.type = externalSubTab.toLowerCase();
        }
      } else {
        // Original internal projects logic
        params.type = tab === "All" ? "" : tab;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: params,
      });

      const responseData = response.data;

      // console.log("Full response data (from Axios):", responseData);

      let projectsData;

      if (tab === "external") {
        // External API: responseData.data.projects
        projectsData = responseData.data?.projects;
      } else {
        // Internal API: responseData.data.projects
        projectsData = responseData.data?.projects;
      }

      if (projectsData && projectsData.data) {
        //             const filteredProjects = projectsData.data.filter(
        //     (project) => project.is_hold !== 1
        // );
        //         setProjects(filteredProjects);
        setProjects(projectsData.data);
        setCurrentPage(projectsData.current_page);
        setItemsPerPage(projectsData.per_page);
        setTotalItems(projectsData.total);
      } else {
        console.warn("Unexpected data structure:", responseData);
        setProjects([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      // Add more detailed error logging
      if (error.response) {
        console.error("Server responded with:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      setProjects([]);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects(currentPage);
    }
  }, [
    currentPage,
    token,
    activeTab,
    externalSubTab,
    searchQuery,
    refreshTrigger,
  ]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleProjectStatusChange = () => {
    setRefreshTrigger((prev) => prev + 1); // This will trigger a re-fetch
  };

  return (
    <div className="origin-top-left scale-[0.75] w-[133.33%] max-h-[70vh]">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="mb-6 text-3xl font-bold">Solar Projects</h1>

          {/* Middle section: Navigation tabs */}
          <div className="md:flex">
            <div className="flex space-x-4 ">
              <div className="relative">
                <button
                  className={`px-3 py-1 rounded-md text-m font-medium ${
                    activeTab === "All"
                      ? "text-teal-400"
                      : "text-teal-600 hover:text-teal-600"
                  }`}
                  onClick={() => {
                    setActiveTab("All");
                    setCurrentPage(1);
                  }}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-m font-medium ${
                    activeTab === "Ongrid"
                      ? "text-teal-400"
                      : "text-teal-600 hover:text-teal-600"
                  }`}
                  onClick={() => {
                    setActiveTab("Ongrid");
                    setCurrentPage(1);
                  }}
                >
                  On-grid
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-m font-medium ${
                    activeTab === "Offgrid"
                      ? "text-teal-400"
                      : "text-teal-600 hover:text-teal-600"
                  }`}
                  onClick={() => {
                    setActiveTab("Offgrid");
                    setCurrentPage(1);
                  }}
                >
                  Off-grid & Hybrid
                </button>

                <button
                  className={`px-3 py-1 rounded-md text-m font-medium ${
                    activeTab === "external"
                      ? "text-teal-400"
                      : "text-teal-600 hover:text-teal-600"
                  }`}
                  onClick={() => {
                    setActiveTab("external");
                    setCurrentPage(1);
                  }}
                >
                  External
                </button>

                {/* External Sub Tabs - Positioned absolutely below the External button */}
                {activeTab === "external" && (
                  <div className="absolute left-0 z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md top-full min-w-max">
                    <div className="flex p-1 space-x-1">
                      <button
                        className={`flex-1 px-2 py-1 text-sm rounded ${
                          externalSubTab === "All"
                            ? "bg-teal-100 text-teal-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setExternalSubTab("All");
                          setCurrentPage(1);
                        }}
                      >
                        All
                      </button>
                      <button
                        className={`flex-1 px-2 py-1 text-sm rounded ${
                          externalSubTab === "Ongrid"
                            ? "bg-teal-100 text-teal-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setExternalSubTab("Ongrid");
                          setCurrentPage(1);
                        }}
                      >
                        On-grid
                      </button>
                      <button
                        className={`flex-1 px-2 py-1 text-sm rounded ${
                          externalSubTab === "Offgrid"
                            ? "bg-teal-100 text-teal-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setExternalSubTab("Offgrid");
                          setCurrentPage(1);
                        }}
                      >
                        Off-grid
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right section: Search bar and Add button */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search"
                  className="w-64 px-4 py-2 pl-10 text-gray-700 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <svg
                  className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <div className="relative flex space-x-3">
                <div className="relative inline-block group">
                  <button
                    className="flex items-center justify-center w-10 h-10 text-white transition-transform duration-200 bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 hover:transform hover:scale-105"
                    onClick={() => {
                      setShowAddModel(true);
                    }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </button>

                  {/* Label appearing on top */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[9999]">
                    <span className="bg-gray-800 text-white text-[11px] px-2 py-1 rounded shadow-xl whitespace-nowrap">
                      Add New
                    </span>
                    {/* Arrow */}
                    <div className="w-2 h-2 -mt-1 rotate-45 bg-gray-800"></div>
                  </div>
                </div>
                {showAddModel && (
                  <div className="absolute right-0 z-50 mt-1 top-full">
                    <AddModel
                      show={showAddModel}
                      onClose={() => setShowAddModel(false)}
                    />
                  </div>
                )}

                <div className="relative inline-block group">
                  {/* The Icon Container */}
                  <div
                    className="flex items-center justify-center p-2 mt-3 text-white transition-all bg-teal-600 rounded-md shadow-md cursor-pointer md:mt-0 hover:bg-teal-700 hover:scale-105"
                    onClick={() => navigate("/holdprojects")}
                  >
                    <HourglassTopIcon fontSize="medium" />
                  </div>

                  {/* The Tooltip Label */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[9999]">
                    <span className="bg-gray-800 text-white text-[11px] px-2 py-1 rounded shadow-xl whitespace-nowrap">
                      Hold Projects
                    </span>
                    {/* Arrow */}
                    <div className="w-2 h-2 -mt-1 rotate-45 bg-gray-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Table Section */}
        <div className="px-10 mt-10 overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-sm tracking-wider text-left text-gray-500 uppercase">
                <th className="px-6 py-3 font-semibold">Project ID</th>
                <th className="px-6 py-3 font-semibold">Project Name</th>
                <th className="px-6 py-3 font-semibold">Location</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <SolarProjectRow
                    key={project.id}
                    project={project}
                    onStatusChange={handleProjectStatusChange}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-500">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-10 right-20">
          {/* Pagination Controls */}
          {projects.length > 0 && (
            <div className="flex justify-end mt-6">
              <button
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                className="px-4 py-2 mx-2 text-white bg-teal-500 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                {currentPage} / {Math.ceil(totalItems / itemsPerPage)}
              </span>
              <button
                onClick={() =>
                  currentPage < Math.ceil(totalItems / itemsPerPage) &&
                  setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                className="px-4 py-2 mx-2 text-white bg-teal-500 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
