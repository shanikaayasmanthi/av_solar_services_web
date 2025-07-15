import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext";

const ScheduledServices = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDetailsClick = () => {
    navigate('/Searchservices');
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/services/scheduled', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });

        if (response.data?.data?.services) {
          setServices(response.data.data.services);
        } else {
          setError('Invalid data format received');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [token]);

  if (loading) return (
    <div className="text-center p-6 bg-white rounded-lg shadow-sm">
      <div className="animate-pulse text-lg font-semibold text-teal-600">Loading services...</div>
    </div>
  );
  if (error) return (
    <div className="text-center p-6 bg-white rounded-lg shadow-sm text-red-500 font-semibold">
      Error: {error}
    </div>
  );
  if (services.length === 0) return (
    <div className="text-center p-6 bg-white rounded-lg shadow-sm text-gray-600 font-semibold">
      No scheduled services found
    </div>
  );

  return (
    <div className="relative mx-auto">
      
        <h1 className="text-3xl font-bold text-gray-800 mb-5">Services</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Scheduled Services</h2>


      <div className="absolute top-4 right-6 flex gap-4">
        {/* <div className="rounded-full p-3 bg-teal-500 text-white cursor-pointer shadow-md hover:bg-teal-600 transition-colors duration-200">
          <AssignmentLateOutlinedIcon fontSize="large" />
        </div> */}
        <div className="rounded-md md:p-2 bg-teal-500 text-white cursor-pointer shadow-md hover:bg-teal-600 transition-colors hover:scale-110 duration-200" onClick={handleDetailsClick}>
          <AssignmentTurnedInOutlinedIcon fontSize="medium" />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {services.map((service, index) => (
            <ServiceBox key={service.service_id || index} service={service} />
          ))}
        </div>
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
    <div className="min-w-[200px] p-5 bg-white rounded-xl md:w-[350px] md:h-[200px] shadow-md hover:shadow-lg transition-shadow duration-300 border border-[2px] hover:border-gray-400 hover:scale-105 border-gray-250">
      <p className="text-base font-semibold text-teal-600">Project No. {service.project_no || 'N/A'}</p>
      <p className="text-sm font-medium text-gray-700">{service.customer_name || 'No customer'}</p>
      <p className="text-sm text-gray-600">
        {service.service_round ? `${getOrdinalSuffix(service.service_round)} service round` : 'Service round not specified'}
      </p>
      <p className="text-sm text-gray-600">{displayDate}{displayTime}</p>
      <p className="text-sm font-medium text-gray-700 mt-2">Assigners:</p>
      {service.supervisors && service.supervisors.length > 0 ? (
        service.supervisors.map((sup, i) => (
          <p key={i} className="text-sm text-gray-600 ml-4">{sup}</p>
        ))
      ) : (
        <p className="text-sm text-gray-500 ml-4">No supervisors assigned</p>
      )}
    </div>
  );
};

export default ScheduledServices;