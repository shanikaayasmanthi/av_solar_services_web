import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const CompletedServices = () => {
  const { project_id } = useParams();
  const location = useLocation();
console.log("Location state in ServiceDetail:", location.state);

  
  const navigate = useNavigate();
  const { token } = useAuth();

  const [serviceRounds, setServiceRounds] = useState([]);

  const projectNo = location.state?.project_no || 'Unknown';
  const customerName = location.state?.customer_name || 'Unknown';
  const town = location.state?.nearest_town || '';

  useEffect(() => {
    const fetchCompletedServices = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/services/completed-by-project-id`, {
          params: { project_id },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });
        setServiceRounds(response.data.data.services);
      } catch (error) {
        console.error("Error fetching completed services:", error);
      }
    };

    if (project_id) fetchCompletedServices();
  }, [project_id, token]);

  
  const handleDetailsClick = (service) => {
    if (!service || !service.service_id) {
      console.warn("Invalid service object or missing service_id:", service);
      return;
    }
console.log("Navigating with service:", service);

    navigate('/servicedetails', {
      state: {
        serviceId: service.service_id,
        project_id: service.project_id,
      },
    });
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="relative">
        <h1 className="text-3xl font-bold mb-3">Project No: {projectNo} - Completed Services</h1>
        <h2 className="text-lg font-medium mb-10">Customer: {customerName} - {town}</h2>

        <div className="flex flex-col gap-4">
          {serviceRounds.length === 0 ? (
            <div className="text-gray-500">No completed service rounds found.</div>
          ) : (
            serviceRounds.map((service, index) => {
              console.log("Service object:", service);
              return (
                <div
                  key={index}
                  className="flex flex-row gap-12 items-center border border-gray-300 p-4 rounded-md bg-gray-100 max-w-xl"
                >
                  <span className="font-semibold">
                    {service.service_round} Round Service - {service.service_date}
                  </span>
                  <button
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded"
                    onClick={() => handleDetailsClick(service)}
                  >
                    View
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedServices;
