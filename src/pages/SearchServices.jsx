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
    const combined = `${project.project_no} ${project.customer_name} ${project.nearest_town}`.toLowerCase();
    return combined.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="relative">
        <h1 className="mb-10 text-3xl font-bold">Completed Services</h1>
      
      <div className="flex justify-center mb-8">
        <div className="mb-6 min-w-[500px] relative">
          <input
            type="text"
            placeholder="Search by project no, name, or town..."
            className="w-full p-4 pr-10 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <SearchIcon />
          </div>
        </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredProjects.length === 0 ? (
            <div className="text-gray-500">No matching projects found.</div>
          ) : (
            filteredProjects.map((project, index) => (
              <div
                key={index}
                className="w-full max-w-lg flex justify-between items-center p-4 border border-gray-400 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => handleDetailsClick(project)}
              >
                <span className="font-medium">#{project.project_no}</span>
                <span>{project.customer_name} - {project.nearest_town}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchServices;
