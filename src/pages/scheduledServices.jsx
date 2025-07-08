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

  if (loading) return <div className="text-center text-lg font-semibold">Loading services...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
  if (services.length === 0) return <div className="text-center">No scheduled services found</div>;

  return (
    <div className="relative">
      <h1 className="mb-6 text-3xl font-bold">Services</h1>
      <h2 className="mt-4 ml-[18%] text-[22px] font-semibold text-black">
        Scheduled Services
      </h2>

      <div className="absolute top-0 right-10 flex gap-4 mt-2">
        {/* <div className="rounded-xl p-2 bg-teal-500 text-white cursor-pointer">
          <AssignmentLateOutlinedIcon fontSize="large" />
        </div> */}
        <div className="rounded-xl p-2 bg-teal-500 text-white cursor-pointer" onClick={handleDetailsClick}>
          <AssignmentTurnedInOutlinedIcon fontSize="large" />
        </div>
      </div>

      <div className="mt-10 ml-[10%] flex flex-col gap-6">
        <div className="flex flex-wrap gap-6">
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
    <div className="p-4 bg-gray-200 rounded-xl w-[300px] h-[200px] shadow">
      <p className="text-sm font-semibold">Project No. {service.project_no || 'N/A'}</p>
      <p className="text-sm">{service.customer_name || 'No customer'}</p>
      <p className="text-sm">
        {service.service_round ? `${getOrdinalSuffix(service.service_round)} service round` : 'Service round not specified'}
      </p>
      <p className="text-sm">{displayDate}{displayTime}</p>
      <p className="text-sm mt-2">Assigners:</p>
      {service.supervisors && service.supervisors.length > 0 ? (
        service.supervisors.map((sup, i) => (
          <p key={i} className="text-sm ml-4">{sup}</p>
        ))
      ) : (
        <p className="text-sm ml-4">No supervisors assigned</p>
      )}
    </div>
  );
};

export default ScheduledServices;
