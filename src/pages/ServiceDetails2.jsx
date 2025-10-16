import React, {useEffect, useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import RoofWork from '../components/RoofWork';
import { useParams,useLocation,useNavigate } from 'react-router-dom';
import OutdoorWork from '../components/OutdoorWork';
import MainPanelWork from '../components/MainPanelWork';
import { useAuth } from '../contexts/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalPrintshopSharpIcon from '@mui/icons-material/LocalPrintshopSharp';
import axios from 'axios';
import { BASE_URL } from "../constants/BaseUrl.jsx";

const ServiceDetails2 = () => {
  const location = useLocation();
  const { service_id } = useParams();
  const navigate = useNavigate();
  //const serviceId = location.state?.serviceId;
  const projectId = location.state?.project_id;
  const projectNo = location.state?.project_no || 'Unknown';
  const customerName = location.state?.customer_name || 'Unknown';
  const town = location.state?.nearest_town || '';
  const serviceRound = location.state?.service_round || 'Unknown';

  const { token } = useAuth(); 
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}api/service/technicians`,
          { service_id: service_id },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            }
          }
        );
        setTechnicians(response.data.data.technicians);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };

    if (service_id) {
      fetchTechnicians();
    }
  }, [service_id]);

    const handlePrint = () => {
  const printContent = document.getElementById("printable-content").outerHTML;
  const printWindow = window.open("", "_blank", "width=900,height=700");
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Service Detail - ${ServiceDetails2.project_no}</title>
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
        <h1>Service Report Part 2</h1>
        
        
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
    <div className="origin-top-left scale-[0.75] w-[133.33%]">
    <div className="relative">
      <div className="flex gap-2 items-start">
  <div
    className="text-black cursor-pointer bg-transparent px-2 py-2 hover:bg-teal-100 rounded-md transition-colors duration-200"
    onClick={() => navigate(-1)}
  >
    <ArrowBackIcon fontSize="medium" />
  </div>
  <div>
         <h1 className="text-3xl font-bold mb-3">Project No: {projectNo} - Completed Services</h1>


  </div>
</div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <h2 className="text-xl font-medium mb-5">
          Customer: {customerName} - {town} (Service Round {serviceRound} )
        </h2>
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

      <div className="flex flex-col gap-8">
        <div id="printable-content">
        {/* Roof Work */}
        <div>
          <div className="overflow-x-auto">
            <RoofWork serviceId={service_id} />
          </div>
        </div>

        {/* Outdoor Work */}
        <div>
          <div className="overflow-x-auto">
            <OutdoorWork serviceId={service_id} />
          </div>
        </div>

        {/* Main Panel Work */}
        <div>
          <div className="overflow-x-auto">
            <MainPanelWork serviceId={service_id} />
          </div>
        </div>

        {/* Technicians Involved */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Technicians Involved:</h3>
          {technicians.length > 0 ? (
            <ul className="list-disc list-inside text-gray-800 ml-10">
              {technicians.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No technicians assigned.</p>
          )}
        </div>
        </div>
        <div className="flex justify-end mt-5">
  <button
    onClick={() => navigate(-1)}
    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-transform duration-200 hover:scale-105"
  >
    Previous
  </button>
</div>

      </div>
    </div>
    </div>
  );
};

export default ServiceDetails2;

