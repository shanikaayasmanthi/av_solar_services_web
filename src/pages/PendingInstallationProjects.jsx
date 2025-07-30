import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PendingInstallationProjects() {
    const [allProjects, setAllProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Changed to 8 items per page
    const [totalItems, setTotalItems] = useState(0);
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const fetchPendingProjects = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/projects/non-installed`,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            const responseData = response.data;

            if (responseData.status === 'success' && responseData.data && responseData.data.projects) {
                setAllProjects(responseData.data.projects);
                setFilteredProjects(responseData.data.projects);
                setTotalItems(responseData.data.projects.length);
            } else {
                console.warn("Unexpected data structure:", responseData);
                setAllProjects([]);
                setFilteredProjects([]);
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Error fetching pending projects:', error);
            setAllProjects([]);
            setFilteredProjects([]);
            setTotalItems(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPendingProjects();
        }
    }, [token]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredProjects(allProjects);
            setTotalItems(allProjects.length);
            setCurrentPage(1);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = allProjects.filter(project => {
            return (
                (project.project_name && project.project_name.toLowerCase().includes(query)) ||
                (project.project_no && project.project_no.toString().toLowerCase().includes(query)) ||
                (project.customer_name && project.customer_name.toLowerCase().includes(query)) ||
                (project.nearest_town && project.nearest_town.toLowerCase().includes(query))
            );
        });

        setFilteredProjects(filtered);
        setTotalItems(filtered.length);
        setCurrentPage(1);
    }, [searchQuery, allProjects]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate paginated projects
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);


    const handleViewDetails = (project) => {
        navigate(`/pendingInstallationProjectsDetails/${project.project_id}`, {
            state: {
                projectName: project.project_name,
                projectNo: project.project_no
            }
        });
    };

    return (
        <div className="origin-top-left scale-[0.75] w-[133.33%]">
        <div className="relative mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Pending Installation Projects</h1>
                
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by project name, number, customer or town..."
                        className="w-96 px-4 py-2 pl-10 text-gray-700 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
            ) : currentProjects.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentProjects.map((project) => (
                            <div key={project.project_id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.project_name || 'Unnamed Project'}</h3>
                                            <p className="text-m font-semibold text-gray-800">#{project.project_no}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-s font-semibold rounded-md
                                            ${project.type === 'ongrid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {project.type === 'ongrid' ? 'On-Grid' : 'Off-Grid'}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            <span className="text-sm font-semibold text-gray-600">{project.customer_name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            <span className="text-sm font-semibold text-gray-600">{project.nearest_town}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end">
                                        <button 
                                            onClick={() => handleViewDetails(project)}
                                            className="px-3 py-1 text-sm text-white bg-teal-600 hover:bg-teal-700 font-medium rounded-md border border-teal-500 hover:border-teal-800 hover:transform hover:scale-105 transition-transform duration-200"
                                        >
                                            Installation Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProjects.length > itemsPerPage && (

                        <div className="flex justify-end items-center mt-6 space-x-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 mx-1 text-white bg-teal-500 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="px-2 py-2 font-semibold">{currentPage} / {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 mx-1 text-white bg-teal-500 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                        {searchQuery ? 'No matching projects found' : 'No pending installation projects'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchQuery ? 'Try a different search term' : 'All projects have been installed or no projects are awaiting installation.'}
                    </p>
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="mt-4 px-4 py-2 text-sm text-teal-600 hover:text-teal-800 font-medium rounded-md border border-teal-200 hover:border-teal-300"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </div>
        </div>
    );
}