import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PendingInstallationCustomerCard from '../components/PendingInstallationCustomerCard';
import PendingInstallationForm from '../components/PendingInstallationForm';
import ProjectGridDetails from '../components/ProjectGridDetails';

export default function PendingInstallationProjectsDetails() {
  const { project_id } = useParams();
  const { token } = useAuth();
  const location = useLocation();

  const [projectDetails, setProjectDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extracting projectName and projectNo from location.state
  const projectName = location?.state?.projectName || "Project Name Not Available";
  const projectNo = location?.state?.projectNo || "Project No Not Available";

  return (
    <div className="relative mx-auto">
      <h1 className="text-3xl font-bold mb-2">Project No : {projectNo} - Installation Details</h1>
      <h2 className="text-2xl font-semibold mb-8"> {projectName}</h2>


  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
    <PendingInstallationForm />
    <ProjectGridDetails projectId={project_id} />
    <PendingInstallationCustomerCard projectId={project_id} />

  </div>
    </div>
    );
}
        