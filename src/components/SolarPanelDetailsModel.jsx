import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';


const SolarPanelDetailsModel = ({show,onClose , projectId,panelCapacity}) => {

  if (!show) {
    return null;
  }
  
  const {token} = useAuth();
  const [loadingData, setLoadingData] = useState(true);
  const [solarPanelData, setSolarPanelData] = useState([]);
  const [error, setError] = useState(null);

  const fetchSolarPanelData = async () => {
    try{
        const response = await axios.get('http://127.0.0.1:8000/api/get-solar-panel',
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
                params: {
                project_id: projectId
                }
            }
        );
        if(response.status === 200){
            const responseData = response.data.data.solar_panels;
            setSolarPanelData(responseData);
            
            setLoadingData(false);
            // console.log("Solar Panel Data:", responseData);
            
            
        }else if(response.status === 404){
            setLoadingData(false);
            setError("No panel data added to this project.");
        }
        else{
            console.error("Failed to fetch solar panel data:", response.data.message);
            setError("Failed to fetch solar panel data.");
            setLoadingData(false);
        }
    }catch(error){
        console.error("Error fetching solar panel data:", error);
        setError("An error occurred while fetching solar panel data.");
        setLoadingData(false);
    }
  }

  useEffect(()=>{
    fetchSolarPanelData();
  },[projectId])
  
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999] p-5 box-border"
      onClick={onClose} 
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white p-5 rounded-xl w-[740px]  max-w-[800px] max-h-[70vh] overflow-y-auto shadow-lg flex flex-col gap-4 box-border
                   sm:p-4 md:p-5" 
      >
        <span
          className="absolute top-2.5 right-4 text-2xl cursor-pointer" 
          onClick={onClose}
        >
          &times;
        </span>

        <h2 className="mb-2 text-xl font-semibold">Solar Panel Details</h2>

        {/* Table Wrapper for Responsiveness */}
        {loadingData ? (
          <p className="py-4 text-center">Loading solar panel data...</p>
        ) : error ? (
          <p className="py-4 text-center text-red-500">{error}</p>
        ) : solarPanelData.length === 0 ? (
          <p className="py-4 text-center">No solar panel data available for this project.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-black border-collapse mt-1.5 mb-1.5">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Panel model</th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Panel model code</th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Panel Type</th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Wattage of panel</th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">No of panels</th>
                  </tr>
                </thead>
                <tbody>
                  {solarPanelData.map((panel, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{panel.solar_panel_model}</td>
                      <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{panel.panel_model_code}</td>
                      <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{panel.panel_type}</td>
                      <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{panel.wattage_of_pannel}</td>
                      <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{panel.no_of_panels}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Capacity Text */}
            {/* Display the calculated total capacity */}
            <p className="text-base">Capacity - {panelCapacity}kw</p>
          </>
        )}

        {/* Button Wrapper */}
        <div className="flex justify-end sm:justify-center">
          {/* Button */}
          <button
            className="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-full cursor-pointer transition-colors duration-300 hover:bg-[#007b6b]
                       w-auto sm:w-1/4 sm:px-3 sm:py-2"
            onClick={() => setShowModal(true)}
          >
            Changes on panels
          </button>
        </div>

        {/* Nested Modal */}
        {/* <SelectChanges show={showModal} onClose={() => setShowModal(false)} /> */}
      </div>
    </div>
  );
};

export default SolarPanelDetailsModel;