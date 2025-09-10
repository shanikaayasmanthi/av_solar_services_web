import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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


  const getOrdinal = (number) => {
    if (!Number.isInteger(Number(number))) return number;
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = number % 100;
    const suffix = (value >= 11 && value <= 13) ? 'th' : suffixes[number % 10] || 'th';
    return `${number}${suffix}`;
  };

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

    navigate(`/servicedetails/${service.service_id}/${service.project_id}`, {
      state: {
        serviceId: service.service_id,
        project_id: service.project_id,
        project_no: service.project_no,
        customer_name: service.customer_name,
        nearest_town: service.nearest_town,
        service_round: service.service_round,
        service_date: service.service_date,
        service_time: service.service_time,
        supervisor_name: service.supervisor_name,
        power: service.power,
        power_time: service.power_time,
      },
    });
  };

    // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // This will format to local date format
      
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; 
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
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
    <h2 className="text-xl font-medium text-gray-600 mb-8">Customer: {customerName} - {town}</h2>
  </div>
</div>


        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {serviceRounds.length === 0 ? (
            <div className="text-center text-gray-500 bg-gray-50 p-6 rounded-lg shadow-sm">
              No completed service rounds found.
            </div>
          ) : (
            serviceRounds.map((service, index) => {
              console.log("Service object:", service);
              return (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between border border-gray-300 border-2 p-4 rounded-lg bg-white shadow-md transition-shadow duration-300 max-w-lg w-full sm:max-w-xl mt-4"
                >
                  <span className="font-semibold text-gray-700 text-lg">
                    {getOrdinal(service.service_round)} ({service.service_type}) Round Service - {formatDate(service.service_date)}
                  </span>
                  <button
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-medium hover:scale-105 transition-transform duration-200"
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
    </div>
  );
};

export default CompletedServices;

//grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6