import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PendingInstallationCustomerCard from '../components/PendingInstallationCustomerCard';
import PendingInstallationForm from '../components/PendingInstallationForm';
import ProjectGridDetails from '../components/ProjectGridDetails';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function PendingInstallationProjectsDetails() {
  const { project_id } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [projectDetails, setProjectDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extracting projectName and projectNo from location.state
  const projectName = location?.state?.projectName || "Project Name Not Available";
  const projectNo = location?.state?.projectNo || "Project No Not Available";

  return (
    <div className="origin-top-left scale-[0.75] w-[133.33%]">
    <div className="relative mx-auto">
<div className="flex gap-1 items-start">
  <div
    className="text-black cursor-pointer bg-transparent px-2 py-2 hover:bg-teal-100 rounded-md transition-colors duration-200"
    onClick={() => navigate(-1)}
  >
    <ArrowBackIcon fontSize="medium" />
  </div>
  <div>
    <h1 className="text-3xl font-bold text-gray-800 mb-5">Project No: {projectNo} - Completed Services</h1>
    <h2 className="text-2xl font-semibold mb-8"> {projectName}</h2>
  </div>
</div>
      
      


  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
    <PendingInstallationForm />
    <ProjectGridDetails projectId={project_id} />
    <PendingInstallationCustomerCard projectId={project_id} />

  </div>
    </div>
    </div>
    );
}
        