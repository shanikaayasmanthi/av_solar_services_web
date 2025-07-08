import React from 'react';
import ImageIcon from '@mui/icons-material/Image';
import RoofWork from '../components/RoofWork';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import OutdoorWork from '../components/OutdoorWork';


const ServiceDetails2 = () => {
  const location = useLocation();
  const serviceId = location.state?.serviceId;


  return (
    <div className="min-h-screen bg-gray-50 px-10 md:px-20 pt-10">
      <div className="text-2xl font-bold mb-4">Project No: 361 Completed services</div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="text-lg font-medium">
          Customer: Damayanthi De Silva - Malabe (1st Service Round)
        </div>
        <div className="bg-teal-500 text-white rounded-md p-2 mt-4 md:mt-0">
          <ImageIcon fontSize="large" />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Roof Work */}
        <div>
          
          <div className="overflow-x-auto">
            <RoofWork serviceId={serviceId} />
          </div>
        </div>

        {/* Outdoor Work */}
        <div>
          
          <div className="overflow-x-auto">
            <OutdoorWork serviceId={serviceId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails2;
