import React, {useState, useEffect} from 'react';
import ImageIcon from '@mui/icons-material/Image';
import { useParams,useNavigate, useLocation } from 'react-router-dom';
import DCDetails from '../components/DCDetails';
import ACDetails from '../components/ACDetails'; 
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service_id } = useParams();
  const { token } = useAuth();
  const projectId = location.state?.project_id;
  //const serviceId = location.state?.serviceId;

    console.log("Service ID from params:", service_id);

  const projectNo = location.state?.project_no || 'Unknown';
  const customerName = location.state?.customer_name || 'Unknown';
  const town = location.state?.nearest_town || '';
  const serviceRound = location.state?.service_round || 'Unknown';
  const serviceDate = location.state?.service_date || 'Unknown';
  const serviceTime = location.state?.service_time || 'Unknown';
  const supervisorName = location.state?.supervisor_name || 'Unknown';
  const power = location.state?.power || 'Unknown';
  const powerTime = location.state?.power_time || 'Unknown';

  const [locationData, setLocationData] = useState({
    longitude: '',
    latitude: '',
    system_capacity: ''
  }); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/project/location-capacity',
          { project_id: projectId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
        setLocationData({
          longitude: response.data.data.longitude,
          latitude: response.data.data.latitude,
          system_capacity: response.data.data.system_capacity
        });
      } catch (err) {
        console.error("Error fetching location data:", err);
        setLocationData({
          longitude: 'N/A',
          latitude: 'N/A',
          system_capacity: 'N/A'
        });
      }
      finally {
        setIsLoading(false);
      }
    };

    if (projectId) fetchLocationData();
  }, [projectId, token]);

  const handleDetailsClick = () => {
    navigate(`/serviceworkdetails/${service_id}`, {
      state: {
        serviceId: service_id,
        project_id: projectId,
        project_no: projectNo,
        customer_name: customerName,
        nearest_town: town,
        service_round: serviceRound,
      },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Unknown') return 'Unknown';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

   const formatTime = (dateString) => {
    if (!dateString || dateString === 'Unknown') return 'Unknown';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="relative mx-auto">
      {/* Header Section */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Project No: {projectNo} - Completed Services</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-3">
          <div>
            <h2 className="text-xl font-medium text-gray-700">
              <span className="font-semibold">Customer:</span> {customerName} 
              {town && <span className="ml-2">- {town} ( Service Round {serviceRound} )</span>}
            </h2>
            <p className="text-md text-gray-600 mt-2 mb-5">
              {formatDate(serviceDate)} - {serviceTime} • Supervisor : {supervisorName}
            </p>
          </div>

          <div className="mt-3 md:mt-0 bg-teal-500 hover:bg-teal-600 rounded-md p-2 text-white shadow-md transition-colors hover:scale-105 cursor-pointer">
            <ImageIcon fontSize="medium" />
          </div>
        </div>
      </div>

      {/* System Information Cards */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-8">System Information</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-6">
          {[
            { label: "System Capacity", value: locationData.system_capacity ? `${locationData.system_capacity} kW` : 'Loading...' },
            { label: "Inverter Capacity", value: "10 kW" },
            { label: "Power", value: power ? `${power} kW` : 'Loading...' },
            { label: "Time", value: powerTime ? `${formatTime(powerTime)}` : 'Loading...' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-3 border border-gray-300 hover:scale-105 transition-transform duration-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
              <p className="text-md font-semibold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-300 hover:scale-105 transition-transform duration-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Inverter Serial No.</p>
            <p className="text-md font-semibold mt-1">0902KDI7932750D</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-300 space-between hover:scale-105 transition-transform duration-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Inverter C/C</p>
            <p className="text-md font-semibold mt-1">065289</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-300 hover:scale-105 transition-transform duration-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</p>
            <p className="text-md font-semibold mt-1">{locationData.longitude || 'Loading...'}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-300 hover:scale-105 transition-transform duration-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</p>
            <p className="text-md font-semibold mt-1">{locationData.latitude || 'Loading...'}</p>
          </div>
        </div>
      </div>

      {/* DC Table */}
      <div className="mb-10 mt-10">

          <DCDetails serviceId={service_id} />

      </div>

      {/* AC Table */}
      <div className=" mb-10 mt-10 ">

          <ACDetails serviceId={service_id} />

      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={handleDetailsClick}
          className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-2 rounded-lg font-medium transition-transform duration-200 hover:scale-105"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ServiceDetail;