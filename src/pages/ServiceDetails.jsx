import React, {useState, useEffect} from 'react';
import ImageIcon from '@mui/icons-material/Image';
import { useNavigate, useLocation } from 'react-router-dom';
import DCDetails from '../components/DCDetails';
import ACDetails from '../components/ACDetails'; 
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { token } = useAuth();
  const projectId = location.state?.project_id;
  const serviceId = location.state?.serviceId;

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

  console.log("Service ID passed to ServiceDetail:", serviceId);
  console.log("Project ID passed to ServiceDetail:", projectId);
  // Debugging logs to verify the values of serviceId and projectId

  // Handler for the "Next" button
  const handleDetailsClick = () => {
    navigate('/servicedetails2', {
      state: {
        serviceId: serviceId,
      },
    });
  };
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-screen-xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Completed Services</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="text-lg font-medium">
          Customer: Damayanthi De Silva - Malabe (1st Service Round)
        </div>
        <div className="mt-4 md:mt-0 bg-teal-500 rounded-md px-3 py-2 text-white">
          <ImageIcon fontSize="large" />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 text-gray-900">
        <p className="text-base mb-4">2024-01-10 2.00 PM By Rashmika & Pubudu</p>

        {/* System + Inverter Section */}
        <div className="flex flex-col gap-6 mb-8">
          {/* System Info */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "System Capacity", value: locationData.system_capacity ? `${locationData.system_capacity} kW` : 'Loading...' },
              { label: "Invertor Capacity", value: "10 kW" },
              { label: "Power", value: "8007 kW" },
              { label: "Time", value: "03:00" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <p className="text-sm">{item.label}</p>
                <div className="bg-gray-200 px-4 py-2 rounded-lg text-sm text-center">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Inverter Info */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <p className="text-sm">Inverter Serial No.</p>
              <div className="bg-gray-200 px-4 py-2 rounded-lg text-sm text-center">
                0902KDI7932750D
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm">Invertor C/C</p>
              <div className="bg-gray-200 px-4 py-2 rounded-lg text-sm text-center">
                065289
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm">Longitude</p>
              <div className="bg-gray-200 px-4 py-2 rounded-lg text-sm text-center">
                 {locationData.longitude || 'Loading...'}
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm">Lattitide</p>
              <div className="bg-gray-200 px-4 py-2 rounded-lg text-sm text-center">
                {locationData.latitude || 'Loading...'}
              </div>
            </div>
          </div>
        </div>

        {/* DC Table */}
        <div className="overflow-x-auto mt-4">
        <DCDetails serviceId={serviceId} />
        </div>

        {/* AC Table */}
        <div className="overflow-x-auto mt-4">
         <ACDetails serviceId={serviceId} />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleDetailsClick}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;