import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext";
import { BASE_URL } from "../constants/BaseUrl.jsx";

const ScheduledServices = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDetailsClick = () => {
    navigate('/Searchservices');
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/services/scheduled?page=${currentPage}`, {
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [token, currentPage]);

const filteredServices = services.filter((service) => {
  const term = searchTerm.toLowerCase();
  return (
    String(service.project_no || '').toLowerCase().includes(term) ||
    String(service.customer_name || '').toLowerCase().includes(term) ||
    String(service.service_date || '').toLowerCase().includes(term) ||
    String(service.service_type || '').toLowerCase().includes(term) ||
    (Array.isArray(service.supervisors) &&
      service.supervisors.some(sup => String(sup).toLowerCase().includes(term)))
  );
});


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
    <div className="origin-top-left scale-[0.75] w-[133.33%] max-h-[70vh]">
      <div className="relative mx-auto">
        <h1 className="mb-5 text-3xl font-bold text-gray-800">Services</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Scheduled Services</h2>

        {/* Search bar and icon */}
        <div className="absolute flex items-center gap-4 top-4 right-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by project, customer, date, assigner..."
              className="px-4 py-2 pl-10 text-gray-700 bg-gray-100 border border-transparent rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2">
              <SearchIcon />
            </div>
          </div>

          <div className="relative inline-block group">
  {/* The Icon Container */}
  <div
    className="flex items-center justify-center p-2 text-white transition-colors duration-200 bg-teal-500 rounded-md shadow-md cursor-pointer hover:bg-teal-600 hover:scale-110"
    onClick={handleDetailsClick}
  >
    <AssignmentTurnedInOutlinedIcon fontSize="medium" />
  </div>

  {/* The Tooltip Label */}
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[9999]">
    <span className="bg-gray-800 text-white text-[11px] px-2 py-1 rounded shadow-xl whitespace-nowrap">
      View Details
    </span>
    {/* Arrow */}
    <div className="w-2 h-2 -mt-1 rotate-45 bg-gray-800"></div>
  </div>
</div>
        </div>

        {/* Services list */}
        <div className="flex flex-col gap-6 mt-4">
          <div className="grid grid-cols-1 gap-10 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredServices.map((service, index) => (
              <ServiceBox key={service.service_id || index} service={service} />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-5">
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
      <div className="min-w-[150px] p-5 bg-white rounded-xl md:w-[320px] md:h-[180px] shadow-md border-[2px]  border-gray-300">
        <p className="text-base font-semibold text-teal-600">Project No. {service.project_no || 'N/A'}</p>
        <p className="text-sm font-medium text-gray-700">{service.customer_name || 'No customer'}</p>
        <p className="text-sm text-gray-600">
          {service.service_round ? `${getOrdinalSuffix(service.service_round)} (${service.service_type ? service.service_type : 'Unknown'}) service round` : 'Service round not specified'}
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
