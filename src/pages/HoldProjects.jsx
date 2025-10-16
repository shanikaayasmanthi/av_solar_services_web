import React, { useEffect, useState } from "react";
import SolarProjectRow from "../components/SolarProjectRow";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/BaseUrl.jsx";


export default function HoldProjects() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({});
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  //const [page, setPage] = useState(1);

const fetchHoldProjects = async (page = 1) => {
  try {
    const [internalRes, externalRes] = await Promise.all([
      axios.get(`${BASE_URL}api/hold-projects`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page }
      }),
      axios.get(`${BASE_URL}api/hold-external-projects`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page }
      })
    ]);

     // Merge results safely
    const mergedProjects = [
      ...internalRes.data.data.projects.data,
      ...externalRes.data.data.projects.data
    ];

    setProjects(mergedProjects);

    // optional: handle pagination by combining metadata
    setPagination(internalRes.data.data.projects);
  } catch (error) {
    console.error("Error fetching hold projects:", error);
  }
};


  useEffect(() => {
    if (token) fetchHoldProjects();
  }, [token]);

  return (
    <div className="origin-top-left scale-[0.75] w-[133.33%]">
        <div className="relative">
              <div className='flex gap-1 align-middle contents-center'>
            <div className=' text-black cursor-pointer bg-transparent px-2 py-2 hover:bg-teal-100 rounded-md transition-colors duration-200' onClick={() => navigate(-1)}>
              <ArrowBackIcon fontSize='medium' />
            </div>
            <h1 className="text-3xl font-bold ">Hold Projects</h1>

            </div>
      <div className="grid grid-cols-2 gap-6 pl-10 mt-10">
        {projects.length > 0 ? (
          projects.map((project) => (
            <SolarProjectRow
              key={project.id}
              project={project}
              onStatusChange={fetchHoldProjects}
            />
          ))
        ) : (
          <p>No held projects found.</p>
        )}
      </div>
      </div>
    </div>
  );
}
