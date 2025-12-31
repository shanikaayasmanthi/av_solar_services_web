import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BASE_URL } from "../constants/BaseUrl.jsx";

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
        const response = await axios.get(`${BASE_URL}api/services/completed-by-project-id`, {
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
      {/* <Header />
      <Sidebar /> */}
<div className="origin-top-left scale-[0.75] w-[133.33%] max-h-[100vh]">
      <div className="relative mx-auto">
        
<div className="flex items-start gap-1">
  <div
    className="px-2 py-2 text-black transition-colors duration-200 bg-transparent rounded-md cursor-pointer hover:bg-teal-100"
    onClick={() => navigate(-1)}
  >
    <ArrowBackIcon fontSize="medium" />
  </div>
  <div>
    <h1 className="mb-5 text-3xl font-bold text-gray-800">Project No: {projectNo} - Completed Services</h1>
    <h2 className="mb-8 text-xl font-medium text-gray-600">Customer: {customerName} - {town}</h2>
  </div>
</div>


        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-1 lg:grid-cols-3">
          {serviceRounds.length === 0 ? (
            <div className="p-6 text-center text-gray-500 rounded-lg shadow-sm bg-gray-50">
              No completed service rounds found.
            </div>
          ) : (
            serviceRounds.map((service, index) => {
              console.log("Service object:", service);
              return (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between w-full max-w-lg p-4 mt-4 transition-shadow duration-300 bg-white border border-2 border-gray-300 rounded-lg shadow-md sm:max-w-xl"
                >
                  <span className="text-lg font-semibold text-gray-700">
                    {getOrdinal(service.service_round)} ({service.service_type}) Round Service - {formatDate(service.service_date)}
                  </span>
                  <button
                    className="px-5 py-2 font-medium text-white transition-transform duration-200 bg-teal-600 rounded-lg hover:bg-teal-700 hover:scale-105"
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