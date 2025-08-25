import React, { useState, useEffect } from 'react';
import Pagination from 'react-js-pagination';
import SolarProjectRow from '../components/SolarProjectRow';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import AddModel from '../components/AddModel';

export default function SolarProjects() {
    const [activeTab, setActiveTab] = useState('All');
    const [externalSubTab, setExternalSubTab] = useState('All'); // sub-tabs for external
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const { token } = useAuth(); // Destructuring token from useAuth
    const [showAddModel, setShowAddModel] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState("");

    // Function to fetch projects
    const fetchProjects = async (pageNumber = 1, tab = activeTab) => {
    // console.log("Current tab for fetch:", tab);

 try {
        let apiUrl = 'http://127.0.0.1:8000/api/get-projects';
        let params = {
            page: pageNumber,
            query: searchQuery,
        };

        // Determine which API endpoint to call
        if (tab === 'external') {
            apiUrl = 'http://127.0.0.1:8000/api/external-projects';
            // Add external sub-tab filter if not 'All'
            if (externalSubTab !== 'All') {
                params.type = externalSubTab.toLowerCase();
            }
        } else {
            // Original internal projects logic
            params.type = tab === 'All' ? '' : tab;
        }

        const response = await axios.get(apiUrl, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: params
        });

        const responseData = response.data;

        // console.log("Full response data (from Axios):", responseData);

  let projectsData;
        
        if (tab === 'external') {
            // External API: responseData.data.projects
            projectsData = responseData.data?.projects;
        } else {
            // Internal API: responseData.data.projects
            projectsData = responseData.data?.projects;
        }

        if (projectsData && projectsData.data) {
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
        console.error('Error fetching projects:', error);
        setProjects([]);
        setTotalItems(0);
    }
};

    useEffect(() => {
        if (token) {
            fetchProjects(currentPage);
        }
    }, [currentPage, token,activeTab, externalSubTab, searchQuery]); 

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="origin-top-left scale-[0.75] w-[133.33%]">
        <div>
            <div className="flex items-center justify-between">
                {/* Left section: Solar Projects title */}
                <h1 className="mb-6 text-3xl font-bold">SolarProjects</h1>

                {/* Middle section: Navigation tabs */}
                <div className='md:flex'>
                    <div className="flex space-x-4 ">
                        <div className="relative">
                        <button
                            className={`px-3 py-1 rounded-md text-m font-medium ${
                                activeTab === 'All' ? 'text-teal-400' : 'text-teal-600 hover:text-teal-600'
                            }`}
                            onClick={() => setActiveTab('All')}
                        >
                            All
                        </button>
                        <button
                            className={`px-3 py-1 rounded-md text-m font-medium ${
                                activeTab === 'Ongrid' ? 'text-teal-400' : 'text-teal-600 hover:text-teal-600'
                            }`}
                            onClick={() => setActiveTab('Ongrid')}
                        >
                            On-grid
                        </button>
                        <button
                            className={`px-3 py-1 rounded-md text-m font-medium ${
                                activeTab === 'Offgrid' ? 'text-teal-400' : 'text-teal-600 hover:text-teal-600'
                            }`}
                            onClick={() => setActiveTab('Offgrid')}
                        >
                            Off-grid & Hybrid
                        </button>
                       
    <button
        className={`px-3 py-1 rounded-md text-m font-medium ${
            activeTab === 'external' ? 'text-teal-400' : 'text-teal-600 hover:text-teal-600'
        }`}
        onClick={() => setActiveTab('external')}
    >
        External
    </button>

    {/* External Sub Tabs - Positioned absolutely below the External button */}
     {activeTab === 'external' && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-max bg-white rounded-md border border-gray-200 shadow-md z-10">
            <div className="flex p-1 space-x-1">
                <button
                    className={`flex-1 px-2 py-1 text-sm rounded ${
                        externalSubTab === 'All' 
                            ? 'bg-teal-100 text-teal-700 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setExternalSubTab('All')}
                >
                    All
                </button>
                <button
                    className={`flex-1 px-2 py-1 text-sm rounded ${
                        externalSubTab === 'Ongrid' 
                            ? 'bg-teal-100 text-teal-700 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setExternalSubTab('Ongrid')}
                >
                    On-grid
                </button>
                <button
                    className={`flex-1 px-2 py-1 text-sm rounded ${
                        externalSubTab === 'Offgrid' 
                            ? 'bg-teal-100 text-teal-700 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setExternalSubTab('Offgrid')}
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
                        <div className="relative">
                            <button className="flex items-center justify-center w-10 h-10 text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        onClick={()=>{setShowAddModel(true)}}>
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </button>
                        {showAddModel && (
                            <AddModel show={showAddModel} onClose={() => setShowAddModel(false)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* here i want to show the project rows */}
            <div className="grid grid-cols-1 gap-4 pl-10 mt-6">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <SolarProjectRow
                            key={project.id}
                            project = {project}
                            // projectNumber={project.id}
                            // description={project.project_name}
                            // location={project.neatest_town}
                            // type={project.type}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No projects found.</p>
                )}
            </div>

            {/* Pagination Controls */}
               {totalItems > itemsPerPage && (
    <div className="flex justify-end mt-6  right-20">
        <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={totalItems}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass="px-2 py-1 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white rounded-md mx-1 inline-flex items-center justify-center"
            // linkClass="text-gray-500 bg-white  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white rounded-md mx-1 inline-flex items-center justify-center"
            activeLinkClass="text-teal-600 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md inline-flex items-center justify-center"
            prevPageText="Previous"
            nextPageText="Next"
            firstPageText="First"
            lastPageText="Last"
        />
    </div>

)}
            </div>
            </div>
            
    );

}