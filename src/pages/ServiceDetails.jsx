import React, {useState, useEffect} from 'react';
import ImageIcon from '@mui/icons-material/Image';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DCDetails from '../components/DCDetails';
import ACDetails from '../components/ACDetails'; 
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext";
import InverterDetails from '../components/InverterDetails';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalPrintshopSharpIcon from '@mui/icons-material/LocalPrintshopSharp';
import { BASE_URL } from "../constants/BaseUrl.jsx";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service_id, project_id } = useParams();
  const { token } = useAuth();
  
  const [serviceDetails, setServiceDetails] = useState({
    project_no: 'Unknown',
    customer_name: 'Unknown',
    nearest_town: '',
    service_round: 'Unknown',
    service_date: 'Unknown',
    service_time: 'Unknown',
    supervisor_name: 'Unknown',
    power: 'Unknown',
    power_time: 'Unknown'
  });
  
  const [locationData, setLocationData] = useState({
    longitude: '',
    latitude: '',
    system_capacity: ''
  }); 
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch service details
        const serviceResponse = await axios.get(
          `${BASE_URL}api/services/completed-by-project-id`,
          {
            params: { project_id: project_id },
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );

        // Find the specific service by service_id
        const service = serviceResponse.data.data.services.find(
          s => s.service_id.toString() === service_id.toString()
        );

        if (service) {
          setServiceDetails({
            project_no: service.project_no || 'Unknown',
            customer_name: service.customer_name || 'Unknown',
            nearest_town: service.nearest_town || '',
            service_round: service.service_round || 'Unknown',
            service_date: service.service_date || 'Unknown',
            service_time: service.service_time || 'Unknown',
            supervisor_name: service.supervisor_name || 'Unknown',
            power: service.power || 'Unknown',
            power_time: service.power_time || 'Unknown'
          });
        }

        // Fetch location data
        const locationResponse = await axios.get(
          `${BASE_URL}api/project/location-capacity`,
          {
            params: { project_id: project_id },
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
        
        setLocationData({
          longitude: locationResponse.data.data.longitude,
          latitude: locationResponse.data.data.latitude,
          system_capacity: locationResponse.data.data.system_capacity
        });

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (project_id && service_id) {
      fetchData();
    }
  }, [project_id, service_id, token]);

  const handleDetailsClick = () => {
    navigate(`/serviceworkdetails/${service_id}/${project_id}`, {
      state: {
        serviceId: service_id,
        project_id: project_id,
        project_no: serviceDetails.project_no,
        customer_name: serviceDetails.customer_name,
        nearest_town: serviceDetails.nearest_town,
        service_round: serviceDetails.service_round,
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

  const handlePrint = () => {
  const printContent = document.getElementById("printable-content").outerHTML;
  const printWindow = window.open("", "_blank", "width=900,height=700");
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Service Detail - ${serviceDetails.project_no}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, h3, p { margin: 0 0 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .card { border: 1px solid #ddd; padding: 10px; border-radius: 8px; margin-bottom: 10px; }
          .section-title { font-size: 18px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Service Report</h1>
        <h2>Project No: ${serviceDetails.project_no}</h2>
        <p>Customer: ${serviceDetails.customer_name} - ${serviceDetails.nearest_town}</p>
        <p>Service Round: ${serviceDetails.service_round}</p>
        <p>Service Date: ${formatDate(serviceDetails.service_date)} | Time: ${serviceDetails.service_time}</p>
        <p>Supervisor: ${serviceDetails.supervisor_name}</p>
        
        ${printContent}

        <footer style="margin-top: 40px; font-size: 12px; text-align: center;">
          Generated on ${new Date().toLocaleString()}
        </footer>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};


  return (

    <div className="origin-top-left scale-[0.75] w-[133.33%] max-h-[70vh]">
    <div className="relative mx-auto"> 
      <div className="flex gap-2 items-start">
  <div
    className="text-black cursor-pointer bg-transparent px-2 py-2 hover:bg-teal-100 rounded-md transition-colors duration-200"
    onClick={() => navigate(-1)}
  >
    <ArrowBackIcon fontSize="medium" />
  </div>
  <div>
          <h1 className="text-3xl font-bold text-gray-800">
          Project No: {serviceDetails.project_no} - Completed Services
        </h1>
  </div>
</div>
      {/* Header Section */}
      <div className="mb-6 border-b border-gray-200 pb-4">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-3">
          <div>
              <h2 className="text-xl font-medium text-gray-700 mt-1">
              <span className="font-semibold">Customer:</span> {serviceDetails.customer_name} 
              {serviceDetails.nearest_town && (
                <span className="ml-2">- {serviceDetails.nearest_town} (Service Round {serviceDetails.service_round})</span>
              )}
            </h2>  

            <p className="text-md text-gray-600 mt-2 mb-5">
              {formatDate(serviceDetails.service_date)} - {serviceDetails.service_time} • 
              Supervisor: {serviceDetails.supervisor_name}
            </p>
          </div>
<div className="flex justify-between space-x-5 mb-5">
          <div className="mt-3 md:mt-0 bg-teal-500 hover:bg-teal-600 rounded-md p-2 text-white shadow-md transition-colors hover:scale-105 cursor-pointer">
            <ImageIcon fontSize="medium" />
          </div>
                  <div
          className="mt-3 md:mt-0 bg-teal-500 hover:bg-teal-600 rounded-md p-2 text-white shadow-md transition-colors hover:scale-105 cursor-pointer"
          onClick={handlePrint}
        >
          <LocalPrintshopSharpIcon fontSize="medium" />
        </div>
          </div>
        </div>
      </div>
      <div id="printable-content">

      {/* System Information Cards */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-5 text-gray-800">System Information</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-6">
          {[
            { label: "System Capacity", value: locationData.system_capacity ? `${locationData.system_capacity} kW` : 'Loading...' },
            { label: "Power", value: serviceDetails.power !== 'Unknown' ? `${serviceDetails.power} kW` : 'N/A' },
            { label: "Power Time", value: serviceDetails.power_time !== 'Unknown' ? formatTime(serviceDetails.power_time) : 'N/A' },
            { label: "Longitude", value: locationData.longitude || 'Loading...' },
            { label: "Latitude", value: locationData.latitude || 'Loading...' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-3 border border-gray-300 ">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
              <p className="text-md font-semibold mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* inverter details */}
      <div className="mb-10 mt-10">
        <InverterDetails projectId={project_id} />
      </div>

      {/* DC Table */}
      <div className="mb-10 mt-10">
        <DCDetails serviceId={service_id} />
      </div>

      {/* AC Table */}
      <div className="mb-10 mt-10">
        <ACDetails serviceId={service_id} />
      </div>

      </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        
        <button
          onClick={handleDetailsClick}
          className="bg-teal-600 hover:bg-teal-700 text-white mb-5 px-10 py-2 rounded-lg font-medium transition-transform duration-200 hover:scale-105"
        >
          Next
        </button>
      </div>
    </div>  
   
  );
};

export default ServiceDetail;