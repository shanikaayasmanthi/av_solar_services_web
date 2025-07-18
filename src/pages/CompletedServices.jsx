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

    navigate(`/servicedetails/${service.service_id}`, {
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

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="relative px-6 py-4 ">
        <div className=" mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Project No: {projectNo} - Completed Services</h1>
          <h2 className="text-xl font-medium text-gray-600">Customer: {customerName} - {town}</h2>
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
                  className="flex flex-row items-center justify-between border border-gray-200 p-4 rounded-lg bg-white shadow-md hover:shadow-lg  hover:-translate-y-1 transition-shadow duration-300 max-w-lg w-full sm:max-w-xl mt-4"
                >
                  <span className="font-semibold text-gray-700 text-lg">
                    {getOrdinal(service.service_round)} Round Service - {service.service_date}
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
  );
};

export default CompletedServices;

//grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6