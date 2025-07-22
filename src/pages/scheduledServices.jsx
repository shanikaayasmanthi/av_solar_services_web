import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext";

const ScheduledServices = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDetailsClick = () => {
    navigate('/Searchservices');
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/services/scheduled?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });

        if (response.data?.data?.services?.data) {
  setServices(response.data.data.services.data);
  setTotalPages(response.data.data.services.last_page);
  setCurrentPage(response.data.data.services.current_page);
} else {
  setError('Invalid data format received');
}


        // if (response.data?.data?.services) {
        //   setServices(response.data.data.services);
        // } else {
        //   setError('Invalid data format received');
        // }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [token, currentPage]);

  if (loading) return (
    <div className="p-6 text-center bg-white rounded-lg shadow-sm">
      <div className="text-lg font-semibold text-teal-600 animate-pulse">Loading services...</div>
    </div>
  );
  if (error) return (
    <div className="p-6 font-semibold text-center text-red-500 bg-white rounded-lg shadow-sm">
      Error: {error}
    </div>
  );
  if (services.length === 0) return (
    <div className="p-6 font-semibold text-center text-gray-600 bg-white rounded-lg shadow-sm">
      No scheduled services found
    </div>
  );

  return (
    <div className="relative mx-auto">
      
        <h1 className="mb-5 text-3xl font-bold text-gray-800">Services</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Scheduled Services</h2>


      <div className="absolute flex gap-4 top-4 right-6">
        {/* <div className="p-3 text-white transition-colors duration-200 bg-teal-500 rounded-full shadow-md cursor-pointer hover:bg-teal-600">
          <AssignmentLateOutlinedIcon fontSize="large" />
        </div> */}
        <div className="text-white transition-colors duration-200 bg-teal-500 rounded-md shadow-md cursor-pointer md:p-2 hover:bg-teal-600 hover:scale-110" onClick={handleDetailsClick}>
          <AssignmentTurnedInOutlinedIcon fontSize="medium" />
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-8">
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceBox key={service.service_id || index} service={service} />
          ))}
        </div>
      </div>
          <div className="flex justify-end mt-6 ">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 text-white bg-teal-500 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-2 py-2 font-semibold">{currentPage} / {totalPages}</span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-2 py-2 mx-1 text-white bg-teal-500 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
    </div>
  );
};

const ServiceBox = ({ service }) => {
  const displayDate = service.service_date ? new Date(service.service_date).toLocaleDateString() : 'No date';
  const displayTime = service.service_time ? ` ${service.service_time}` : '';

  const getOrdinalSuffix = (number) => {
    if (!number) return 'Service round not specified';
    const j = number % 10, k = number % 100;
    if (j === 1 && k !== 11) return number + 'st';
    if (j === 2 && k !== 12) return number + 'nd';
    if (j === 3 && k !== 13) return number + 'rd';
    return number + 'th';
  };

return (
  <div>
    <div className="min-w-[200px] p-5 bg-white rounded-xl md:w-[350px] md:h-[200px] shadow-md hover:shadow-lg transition-shadow duration-300 border-[2px] hover:border-gray-400 hover:scale-105 border-gray-250">
      <p className="text-base font-semibold text-teal-600">Project No. {service.project_no || 'N/A'}</p>
      <p className="text-sm font-medium text-gray-700">{service.customer_name || 'No customer'}</p>
      <p className="text-sm text-gray-600">
        {service.service_round ? `${getOrdinalSuffix(service.service_round)} service round` : 'Service round not specified'}
      </p>
      <p className="text-sm text-gray-600">{displayDate}{displayTime}</p>
      <p className="mt-2 text-sm font-medium text-gray-700">Assigners:</p>
      {service.supervisors && service.supervisors.length > 0 ? (
        service.supervisors.map((sup, i) => (
          <p key={i} className="ml-4 text-sm text-gray-600">{sup}</p>
        ))
      ) : (
        <p className="ml-4 text-sm text-gray-500">No supervisors assigned</p>
      )}
    </div>

  </div>
);
};

export default ScheduledServices;