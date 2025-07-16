import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';


const InverterDetailsModel = ({show,onClose , projectId}) => {

  if (!show) {
    return null;
  }
  
  const {token} = useAuth();
  const [loadingData, setLoadingData] = useState(true);
  const [inverterData, setInverterData] = useState([]);
  const [error, setError] = useState(null);

  const fetchSolarPanelData = async () => {
    try{
        const response = await axios.get('http://127.0.0.1:8000/api/get-inverters',
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
            const responseData = response.data.data.inverters;
            setInverterData(responseData);
            
            setLoadingData(false);
            // console.log("Solar Panel Data:", responseData);
            
            
        }else if(response.status === 404){
            setLoadingData(false);
            setError("No inverter data added to this project.");
        }
        else{
            console.error("Failed to fetch inverter data:", response.data.message);
            setError("Failed to fetch inverter data.");
            setLoadingData(false);
        }
    }catch(error){
        console.error("Error fetching inverter data:", error);
        setError("An error occurred while fetching inverter data.");
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

        <h2 className="mb-2 text-xl font-semibold">Inverter Details</h2>

        {/* Table Wrapper for Responsiveness */}
        {loadingData ? (
          <p className="py-4 text-center">Loading inverter data...</p>
        ) : error ? (
          <p className="py-4 text-center text-red-500">{error}</p>
        ) : inverterData.length === 0 ? (
          <p className="py-4 text-center">No inverter data available for this project.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-black border-collapse mt-1.5 mb-1.5">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Brand</th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Inv. model code</th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Inv. Check Code</th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Inv. Serial No</th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Inv. Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {inverterData.map((inverter, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{inverter.brand}</td>
                      <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{inverter.invertor_model_no}</td>
                      <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{inverter.invertor_check_code}</td>
                      <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{inverter.invertor_serial_no}</td>
                      <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{inverter.invertor_capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Capacity Text */}
            {/* Display the calculated total capacity */}
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
            Changes on Invertor
          </button>
        </div>

        {/* Nested Modal */}
        {/* <SelectChanges show={showModal} onClose={() => setShowModal(false)} /> */}
      </div>
    </div>
  );
};

export default InverterDetailsModel;