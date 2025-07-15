import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from "../contexts/AuthContext";
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const SearchServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/projects/completed', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setProjects(response.data.data.projects);
      } catch (error) {
        console.error('Error fetching completed services:', error);
      }
    };

    fetchProjects();
  }, [token]);

  const handleDetailsClick = (project) => {
    navigate(`/completedservices/${project.project_id}`, {
      state: {
        project_no: project.project_no,
        customer_name: project.customer_name,
        nearest_town: project.nearest_town
      }
    });
  };

  const filteredProjects = projects.filter((project) => {
    const combined = `${project.project_no} ${project.project_name} ${project.customer_name} ${project.nearest_town}`.toLowerCase();
    return combined.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="relative">
        <div className="flex items-center justify-between mb-10 mr-10">
          <h1 className="text-3xl font-bold">Completed Services</h1>
          <div className="md:min-w-[200px] relative">
            <input
              type="text"
              placeholder="Search by project no, name, or town..."
              className="w-80 px-15 py-2 pl-10  text-gray-700 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <SearchIcon />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredProjects.length === 0 ? (
            <div className="text-gray-500">No matching projects found.</div>
          ) : (
            <ProjectCard filteredProjects={filteredProjects} handleDetailsClick={handleDetailsClick} />
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ filteredProjects, handleDetailsClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {filteredProjects.map((project, index) => (
        <div
          key={index}
          className="w-full max-w-sm p-6 border border-gray-300 bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          onClick={() => handleDetailsClick(project)}
        >
          <div className="flex items-center justify-end mb-4">
            <span className="text-lg font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full justify-end"> Project No: #{project.project_no}</span>
          </div>

          <div className="grid grid-rows-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide min-w-[100px]">
                Project Name:
              </span>
              <span className="font-semibold text-gray-800">
                {project.project_name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide min-w-[100px]">
                Customer Name:
              </span>
              <span className="font-semibold text-gray-800">
                {project.customer_name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide min-w-[100px]">
                Nearest Town:
              </span>
              <span className="font-semibold text-gray-800">
                {project.nearest_town}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchServices;